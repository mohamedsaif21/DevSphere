'use client';

import { useState, useCallback } from 'react';
import { LanguageKey, TerminalTab, OutputLine, ErrorItem } from '../types/compiler';
import { LANG_CONFIG } from '../constants/languages';
import { parseAIText } from '../utils/helpers';

export type AILine = { type: 'title' | 'text' | 'code' | 'spacer'; content: string };
export type AIState = 'idle' | 'thinking' | 'done' | 'error';

export function useCompiler() {
  const [langKey, setLangKeyState] = useState<LanguageKey>('python');
  const [code, setCode] = useState<string>(LANG_CONFIG.python.starter);
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

  // ── AI DEBUG ────────────────────────────────────────────────────
  const runAIDebug = useCallback(async (codeToDebug: string, errorText: string | null) => {
    setActiveTab('ai');
    setAiState('thinking');
    setAiLines([]);

    const cfg = LANG_CONFIG[langKey];
    
    try {
      const res = await fetch('/api/debug', {
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
      // Fallback built-in analysis
      const fallback = buildFallbackAI(langKey, errorText);
      setAiLines(fallback);
      setAiState('done');
    }
  }, [langKey]);

  // ── RUN CODE ────────────────────────────────────────────────────
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
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: trimmed,
          language: cfg.pistonLang,
          version: cfg.pistonVersion,
          filename: cfg.file,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        const msg =
          typeof data.error === 'string'
            ? data.error
            : 'Run failed. Check your network or try again.';
        const lines: OutputLine[] = [{ text: `⚠ ${msg}`, type: 'error' }];
        if (typeof data.hint === 'string') {
          lines.push({ text: data.hint, type: 'info' });
        } else {
          lines.push({
            text: 'Runs go to Piston via /api/run. If emkc returns 401, add PISTON_API_KEY to .env.local.',
            type: 'info',
          });
        }
        setOutputLines(lines);
        setActiveTab('output');
        return;
      }

      const stdout: string = data.run?.stdout || '';
      const stderr: string = (data.run?.stderr || '') + (data.compile?.stderr || '');
      const exitCode: number = data.run?.code ?? 0;

      const lines: OutputLine[] = [
        { text: `▶ ${cfg.name} · ${cfg.file} · Piston API`, type: 'info' },
      ];
      if (stdout) {
        stdout.split('\n').forEach((l) => lines.push({ text: l, type: 'output' }));
      }
      if (stderr.trim()) {
        stderr.split('\n').filter(Boolean).forEach((l) => lines.push({ text: l, type: 'error' }));
      }
      if (!stdout && !stderr.trim()) {
        lines.push({ text: 'Program exited with no output.', type: 'info' });
      }
      lines.push({ text: `Process finished. Exit code: ${exitCode}`, type: 'prompt' });

      setOutputLines(lines);

      if (stderr.trim()) {
        const errLines = stderr.split('\n').filter((l) =>
          /error|exception|traceback|cannot/i.test(l)
        );
        const count = errLines.length || 1;
        setErrorCount(count);
        setErrorItems(
          stderr
            .split('\n')
            .filter(Boolean)
            .map((l) => ({
              message: l,
              isError: /error|exception|traceback/i.test(l),
            }))
        );
        // Auto-trigger AI
        await runAIDebug(trimmed, stderr.trim());
      } else {
        setErrorCount(0);
        setErrorItems([]);
        setAiLines([
          { type: 'title', content: '✓ Code ran successfully!' },
          { type: 'text', content: 'No errors detected. Great work!' },
        ]);
        setAiState('done');
      }
    } catch {
      setOutputLines([
        { text: '⚠ Network error: Could not reach Piston API.', type: 'error' },
        { text: 'Check your internet connection and try again.', type: 'info' },
      ]);
    } finally {
      setIsRunning(false);
    }
  }, [code, langKey, runAIDebug]);

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
    outputLines,
    errorItems,
    aiLines, aiState,
    isRunning,
    activeTab, setActiveTab,
    errorCount,
    runCode, debugCode, clearOutput,
    currentLang: LANG_CONFIG[langKey],
  };
}

// ── FALLBACK AI ────────────────────────────────────────────────────
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
