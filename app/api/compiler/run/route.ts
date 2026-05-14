import { NextRequest, NextResponse } from 'next/server';

const ONECOMPILER_API = 'https://api.onecompiler.com/v1';

const LANGUAGE_CODES: Record<string, string> = {
  python: 'python',
  java:   'java',
  c:      'c',
};

const FILENAMES: Record<string, string> = {
  python: 'main.py',
  java:   'Main.java',
  c:      'main.c',
};

export async function POST(req: NextRequest) {
  try {
    const { code, language, stdin = '' } = await req.json();

    if (!code || !language) {
      return NextResponse.json({
        stdout: '', stderr: 'Missing code or language.', exitCode: 1, status: 'Bad Request',
      }, { status: 400 });
    }

    const langCode = LANGUAGE_CODES[language as string];
    if (!langCode) {
      return NextResponse.json({
        stdout: '', stderr: `Unsupported language: ${language}`, exitCode: 1, status: 'Bad Request',
      }, { status: 400 });
    }

    const apiKey = process.env.ONECOMPILER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        stdout: '', stderr: 'ONECOMPILER_API_KEY not set in .env.local', exitCode: 1, status: 'Config Error',
      }, { status: 500 });
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    };

    // Execute code via OneCompiler API with correct format
    const executeRes = await fetch(
      `${ONECOMPILER_API}/run`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: langCode,
          files: [
            {
              name: FILENAMES[language as string],
              content: code,
            }
          ],
          stdin: stdin,
        }),
      }
    );

    if (!executeRes.ok) {
      const errText = await executeRes.text();
      throw new Error(`OneCompiler execution failed (${executeRes.status}): ${errText}`);
    }

    const result = await executeRes.json();

    const stdout    = (result.stdout || '') as string;
    const stderr    = (result.stderr || '') as string;
    const exception = (result.exception || '') as string;
    const exitCode  = result.status === 'success' ? 0 : 1;
    const errorOutput = [exception, stderr].filter(Boolean).join('\n').trim();

    return NextResponse.json({
      stdout: stdout.trim(),
      stderr: errorOutput,
      exitCode,
      status: result.status || 'Unknown',
      time: result.executionTime ? `${result.executionTime}ms` : '',
      memory: result.memoryUsed ? `${result.memoryUsed} KB` : '',
      filename: FILENAMES[language as string],
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/compiler/run]', message);
    return NextResponse.json({
      stdout: '', stderr: `Server error: ${message}`, exitCode: 1, status: 'Internal Error',
    }, { status: 500 });
  }
}