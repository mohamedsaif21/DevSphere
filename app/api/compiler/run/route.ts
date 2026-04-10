import { NextRequest, NextResponse } from 'next/server';

const RAPIDAPI_HOST = 'judge029.p.rapidapi.com';
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  java:   62,
  c:      50,
};

const FILENAMES: Record<string, string> = {
  python: 'main.py',
  java:   'Main.java',
  c:      'main.c',
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({
        stdout: '', stderr: 'Missing code or language.', exitCode: 1, status: 'Bad Request',
      }, { status: 400 });
    }

    const languageId = LANGUAGE_IDS[language as string];
    if (!languageId) {
      return NextResponse.json({
        stdout: '',
        stderr: `Unsupported language: ${language}. Use python, java, or c.`,
        exitCode: 1,
        status: 'Bad Request',
      }, { status: 400 });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({
        stdout: '',
        stderr: 'RAPIDAPI_KEY is not set in .env.local',
        exitCode: 1,
        status: 'Config Error',
      }, { status: 500 });
    }

    const headers = {
      'Content-Type':    'application/json',
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key':  apiKey,
    };

    const submitRes = await fetch(
      `${RAPIDAPI_BASE}/submissions?base64_encoded=false&wait=false`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_code:    code,
          language_id:    languageId,
          stdin:          '',
          cpu_time_limit: 5,
          memory_limit:   128000,
        }),
      }
    );

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      throw new Error(`Submit failed (${submitRes.status}): ${errText}`);
    }

    const submitData = await submitRes.json();
    const token: string = submitData.token;
    if (!token) throw new Error('No token returned from Judge0.');

    let result: Record<string, unknown> | null = null;

    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 1000));

      const pollRes = await fetch(
        `${RAPIDAPI_BASE}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,exit_code,time,memory`,
        { method: 'GET', headers }
      );

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const statusId: number = (pollData.status as { id: number })?.id ?? 0;

      if (statusId >= 3) {
        result = pollData as Record<string, unknown>;
        break;
      }
    }

    if (!result) {
      return NextResponse.json({
        stdout: '',
        stderr: 'Execution timed out. Please try again.',
        exitCode: 1,
        status: 'Timeout',
      });
    }

    const stdout        = (result.stdout          as string) ?? '';
    const stderr        = (result.stderr          as string) ?? '';
    const compileOutput = (result.compile_output  as string) ?? '';
    const exitCode      = (result.exit_code       as number) ?? 0;
    const status        = (result.status as { description: string })?.description ?? 'Unknown';
    const time          = (result.time            as string) ?? '';
    const memory        = (result.memory          as number) ?? 0;

    const errorOutput = [compileOutput, stderr].filter(Boolean).join('\n').trim();

    return NextResponse.json({
      stdout:   stdout.trim(),
      stderr:   errorOutput,
      exitCode,
      status,
      time,
      memory:   memory ? `${memory} KB` : '',
      filename: FILENAMES[language as string],
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[/api/compiler/run]', message);
    return NextResponse.json({
      stdout:   '',
      stderr:   `Server error: ${message}`,
      exitCode: 1,
      status:   'Internal Error',
    }, { status: 500 });
  }
}
