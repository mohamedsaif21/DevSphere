'use client';

import { useState, useCallback } from 'react';
import { LanguageKey, TerminalTab, OutputLine, ErrorItem } from '@/types/compiler';
import { LANG_CONFIG } from '@/constants/languages';
import { parseAIText } from '@/utils/compiler-helpers';

export type AILine = { type: 'title' | 'text' | 'code' | 'spacer'; content: string };
export type AIState = 'idle' | 'thinking' | 'done' | 'error';

export function useCompiler() {
  const [langKey, setLangKeyState] = useState<LanguageKey>('python');
  const [code, setCode] = useState<string>(LANG_CONFIG.python.starter);
  const [stdin, setStdin] = useState<string>('');
  const [outputLines, setOutputLines] = useState<OutputLine[]>([
    { text: 'Ready. Write code and click Run.', type: 'info' },
  ]);
  const [errorItems, setErrorItems] = useState<ErrorItem[]>([]);
  const [aiLines, setAiLines] = useState<AILine[]>([]);
  const [aiState, setAiState] = useState<AIState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<TerminalTab>('output');
  const [errorCount, setErrorCount] = useState(0);

  const setLangKey = useCallback((key: LanguageKey) => {
    setLangKeyState(key);
    setCode(LANG_CONFIG[key].starter);
    setOutputLines([{ text: `Ready. Switched to ${LANG_CONFIG[key].name}.`, type: 'info' }]);
    setErrorItems([]);
    setAiLines([]);
    setAiState('idle');
    setErrorCount(0);
  }, []);

  const clearOutput = useCallback(() => {
    setOutputLines([{ text: 'Output cleared.', type: 'info' }]);
    setErrorItems([]);
    setAiLines([]);
    setAiState('idle');
    setErrorCount(0);
  }, []);

  const appendOutputLines = useCallback((lines: OutputLine[]) => {
    if (!lines.length) return;
    setOutputLines((prev) => [...prev, ...lines]);
  }, []);

  const pushOutputLine = useCallback((line: OutputLine) => {
    setOutputLines((prev) => [...prev, line]);
  }, []);

  const runAIDebug = useCallback(async (codeToDebug: string, errorText: string | null) => {
    setActiveTab('ai');
    setAiState('thinking');
    setAiLines([]);

    const cfg = LANG_CONFIG[langKey];
    
    try {
      const res = await fetch('/api/compiler/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToDebug,
          error: errorText,
          language: cfg.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errMsg = typeof data.error === 'string' ? data.error : 'AI debug request failed.';
        const quota = /429|quota|Too Many Requests|limit:\s*0/i.test(errMsg);
        const fallback = buildFallbackAI(langKey, errorText);
        setAiLines([
          {
            type: 'title',
            content: quota ? 'Gemini rate limit / quota' : 'Gemini unavailable',
          },
          { type: 'text', content: errMsg },
          {
            type: 'text',
            content: quota
              ? 'Try again in ~1 minute, remove GEMINI_MODEL from .env.local so the app can fall back across models, or enable billing in Google AI Studio.'
              : 'If the key is missing, set GEMINI_API_KEY in .env.local and restart the dev server. Offline tips below.',
          },
          { type: 'spacer', content: '' },
          ...fallback,
        ]);
        setAiState('done');
        return;
      }

      if (data.text) {
        const parsed = parseAIText(data.text);
        setAiLines(parsed);
        setAiState('done');
      } else {
        throw new Error('No response');
      }
    } catch {
      const fallback = buildFallbackAI(langKey, errorText);
      setAiLines(fallback);
      setAiState('done');
    }
  }, [langKey]);

  const runCode = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setOutputLines([{ text: '⚠ No code to run. Write something first!', type: 'error' }]);
      setActiveTab('output');
      return;
    }

    const cfg = LANG_CONFIG[langKey];
    setIsRunning(true);
    setActiveTab('output');
    setOutputLines([{ text: 'Running...', type: 'info' }]);

    try {
      const res = await fetch('/api/compiler/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code:     trimmed,
          language: langKey,
          stdin,
        }),
      });

      const data = await res.json();

      const stdout:   string = data.stdout  || '';
      const stderr:   string = data.stderr  || '';
      const exitCode: number = data.exitCode ?? 0;
      const status:   string = data.status  || '';
      const execTime: string = data.time    || '';
      const memory:   string = data.memory  || '';

      const lines: OutputLine[] = [
        { text: `▶ ${cfg.name} · ${cfg.file} · Judge0 (RapidAPI)`, type: 'info' },
      ];

      const stdinHints = buildStdinHints(langKey, trimmed, stdin);
      if (stdinHints.length) {
        stdinHints.forEach((hint) => {
          lines.push({ text: hint, type: 'info' });
        });
      }

      if (stdout) {
        stdout.split('\n').forEach((l) => {
          lines.push({ text: l, type: 'output' });
        });
      }

      if (stderr) {
        stderr.split('\n').filter(Boolean).forEach((l) => {
          lines.push({ text: l, type: 'error' });
        });
      }

      if (!stdout && !stderr) {
        lines.push({ text: 'Program exited with no output.', type: 'info' });
      }

      const stats = [
        execTime ? `${execTime}s` : '',
        memory   ? memory         : '',
        status,
      ].filter(Boolean).join(' · ');

      lines.push({ text: `Exit code: ${exitCode}  ${stats}`, type: 'prompt' });

      setOutputLines(lines);

      if (stderr) {
        const errLines = stderr.split('\n').filter((l) =>
          /error|exception|traceback|cannot|undefined|failed/i.test(l)
        );
        setErrorCount(errLines.length || 1);
        setErrorItems(
          stderr.split('\n').filter(Boolean).map((l) => ({
            message:  l,
            isError:  /error|exception|traceback/i.test(l),
          }))
        );
        await runAIDebug(trimmed, stderr.trim());
      } else {
        setErrorCount(0);
        setErrorItems([]);
        setAiLines([
          { type: 'title',   content: '✓ Code ran successfully!' },
          { type: 'text',    content: `Finished in ${execTime || '?'}s · No errors detected.` },
        ]);
        setAiState('done');
      }
    } catch {
      setOutputLines([
        { text: '⚠ Network error: Could not reach the Judge0 API.', type: 'error' },
        { text: 'Check your connection and RAPIDAPI_KEY in .env.local', type: 'info' },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [code, langKey, runAIDebug, stdin]);

  const debugCode = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setActiveTab('ai');
      setAiLines([{ type: 'text', content: '⚠ Please write some code first.' }]);
      setAiState('done');
      return;
    }
    await runAIDebug(trimmed, null);
  }, [code, runAIDebug]);

  return {
    langKey, setLangKey,
    code, setCode,
    stdin, setStdin,
    outputLines,
    errorItems,
    aiLines, aiState,
    isRunning,
    activeTab, setActiveTab,
    errorCount,
    runCode, debugCode, clearOutput,
    appendOutputLines,
    pushOutputLine,
    currentLang: LANG_CONFIG[langKey],
  };
}

function buildStdinHints(lang: LanguageKey, code: string, stdinText: string): string[] {
  const hints: string[] = [];
  const hasStdin = stdinText.trim().length > 0;

  if (lang === 'python') {
    const hasInputCall = /\binput\s*\(/.test(code);
    if (!hasInputCall) return hints;

    const assignedVars = Array.from(
      code.matchAll(/(^|\n)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*input\s*\(/g)
    ).map((m) => m[2]);
    const uniqueVars = assignedVars
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 3);

    if (uniqueVars.length) {
      hints.push(`stdin hint: ${uniqueVars.join(', ')} ${uniqueVars.length > 1 ? 'are variables' : 'is a variable'} that store user input values.`);
    } else {
      hints.push('stdin hint: input() reads from stdin (user-provided input).');
    }

    if (!hasStdin) {
      hints.push('stdin hint: add values in the Program input (stdin) box. Example for n = input(): type 5 (not n).');
    }

    return hints;
  }

  if (lang === 'java') {
    const hasScannerInput = /\bScanner\b|\bnext(Int|Line|Double|Float|Long|Short|Byte|Boolean)\s*\(/.test(code);
    if (!hasScannerInput) return hints;

    hints.push('stdin hint: Scanner reads values from stdin; variables store typed values, not variable names.');
    if (!hasStdin) {
      hints.push('stdin hint: fill Program input (stdin) with values line by line (or space-separated for Scanner).');
    }

    return hints;
  }

  if (lang === 'c') {
    const hasCInput = /\bscanf\s*\(|\bfgets\s*\(|\bgetchar\s*\(/.test(code);
    if (!hasCInput) return hints;

    hints.push('stdin hint: scanf/fgets/getchar read from stdin; C variables receive the typed values.');
    if (!hasStdin) {
      hints.push('stdin hint: provide Program input (stdin) values in the expected order.');
    }

    return hints;
  }

  return hints;
}

function buildFallbackAI(
  lang: LanguageKey,
  errorText: string | null
): AILine[] {
  if (!errorText) {
    return [
      { type: 'title', content: 'Code Review' },
      { type: 'text', content: `Your code looks good! Here are tips for better ${LANG_CONFIG[lang].name}:` },
      { type: 'text', content: '• Use clear, descriptive variable names' },
      { type: 'text', content: '• Add comments to explain complex logic' },
      { type: 'text', content: '• Break large functions into smaller ones' },
      { type: 'text', content: '• Handle edge cases and errors' },
    ];
  }

  if (lang === 'python') {
    if (/SyntaxError/i.test(errorText)) {
      return [
        { type: 'title', content: 'Syntax Error Detected' },
        { type: 'text', content: 'Python cannot understand how you wrote a line or block of code.' },
        { type: 'title', content: 'Common Causes' },
        { type: 'text', content: '• Missing colon : after if/for/def/while' },
        { type: 'text', content: '• Mismatched quotes or brackets' },
        { type: 'text', content: '• Incorrect indentation' },
        { type: 'title', content: 'Fix' },
        { type: 'text', content: 'Check the line number in the error and look for those mistakes.' },
      ];
    }
    if (/NameError/i.test(errorText)) {
      return [
        { type: 'title', content: 'NameError — Variable Not Found' },
        { type: 'text', content: "You're using a variable that hasn't been defined yet." },
        { type: 'code', content: 'x = 10  # Define BEFORE using\nprint(x)' },
      ];
    }
    if (/IndentationError/i.test(errorText)) {
      return [
        { type: 'title', content: 'IndentationError' },
        { type: 'text', content: 'Python uses spaces to know what belongs inside a block. Use 4 spaces consistently.' },
        { type: 'code', content: 'def greet():\n    print("Hello")  # 4 spaces indent' },
      ];
    }
  }

  if (lang === 'java') {
    return [
      { type: 'title', content: 'Java Compilation Error' },
      { type: 'text', content: 'Java must compile before running. Check:' },
      { type: 'text', content: '• Class name matches filename (Main.java → public class Main)' },
      { type: 'text', content: '• All statements end with semicolon ;' },
      { type: 'text', content: '• All brackets are properly closed {}' },
    ];
  }

  if (lang === 'c') {
    return [
      { type: 'title', content: 'C Compilation Error' },
      { type: 'text', content: 'Your C code has a compilation error. Common fixes:' },
      { type: 'text', content: '• Include necessary headers like #include <stdio.h>' },
      { type: 'text', content: '• End all statements with ;' },
      { type: 'text', content: '• Check function return types' },
    ];
  }

  return [
    { type: 'title', content: 'Error Found' },
    { type: 'text', content: 'Read the error message in the Errors tab — it tells you which line has the problem.' },
    { type: 'title', content: 'Tip' },
    { type: 'text', content: 'Search the exact error message online for detailed explanations.' },
  ];
}
