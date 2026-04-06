import { NextRequest, NextResponse } from 'next/server';

// Judge0 language IDs — only Python, Java, C as per your project
const LANGUAGE_IDS: Record<string, number> = {
  python: 71,  // Python 3.8.1
  java:   62,  // Java (OpenJDK 13.0.1)
  c:      50,  // C (GCC 9.2.0)
};

// Default filenames per language
const FILENAMES: Record<string, string> = {
  python: 'main.py',
  java:   'Main.java',
  c:      'main.c',
};

const RAPIDAPI_HOST = 'judge029.p.rapidapi.com';
const RAPIDAPI_URL  = `https://${RAPIDAPI_HOST}`;

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    // Validate
    if (!code || !language) {
      return NextResponse.json(
        { stdout: '', stderr: 'Missing code or language.', exitCode: 1, status: 'Bad Request' },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_IDS[language as string];
    if (!languageId) {
      return NextResponse.json(
        { stdout: '', stderr: `Unsupported language: ${language}. Use python, java, or c.`, exitCode: 1, status: 'Bad Request' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { stdout: '', stderr: 'Server config error: RAPIDAPI_KEY not set.', exitCode: 1, status: 'Config Error' },
        { status: 500 }
      );
    }

    // ── STEP 1: Submit code to Judge0 ──────────────────────────────
    const submitRes = await fetch(
      `${RAPIDAPI_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key':  apiKey,
        },
        body: JSON.stringify({
          source_code:       code,
          language_id:       languageId,
          stdin:             '',
          cpu_time_limit:    5,
          memory_limit:      128000,
        }),
      }
    );

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      throw new Error(`Judge0 submit failed (${submitRes.status}): ${errText}`);
    }

    const submitData = await submitRes.json();
    const token: string = submitData.token;

    if (!token) {
      throw new Error('No token returned from Judge0.');
    }

    // ── STEP 2: Poll for result (max 10 tries, 1s apart) ───────────
    let result: Record<string, unknown> | null = null;

    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((r) => setTimeout(r, 1000));

      const pollRes = await fetch(
        `${RAPIDAPI_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,exit_code,time,memory`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': RAPIDAPI_HOST,
            'x-rapidapi-key':  apiKey,
          },
        }
      );

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const statusId: number = (pollData.status as { id: number })?.id ?? 0;

      // Status IDs: 1 = In Queue, 2 = Processing, 3+ = Done
      if (statusId >= 3) {
        result = pollData as Record<string, unknown>;
        break;
      }
    }

    if (!result) {
      return NextResponse.json({
        stdout:   '',
        stderr:   'Execution timed out. Please try again.',
        exitCode: 1,
        status:   'Timeout',
      });
    }

    // ── STEP 3: Return clean result ────────────────────────────────
    const stdout:        string = (result.stdout        as string) ?? '';
    const stderr:        string = (result.stderr        as string) ?? '';
    const compileOutput: string = (result.compile_output as string) ?? '';
    const exitCode:      number = (result.exit_code     as number) ?? 0;
    const statusDesc:    string = (result.status as { description: string })?.description ?? 'Unknown';
    const execTime:      string = (result.time          as string) ?? '';
    const memory:        number = (result.memory        as number) ?? 0;

    // Merge compile errors + runtime errors
    const errorOutput = [compileOutput, stderr].filter(Boolean).join('\n').trim();

    return NextResponse.json({
      stdout:   stdout.trim(),
      stderr:   errorOutput,
      exitCode,
      status:   statusDesc,
      time:     execTime,
      memory:   memory ? `${memory} KB` : '',
      language: FILENAMES[language],
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[/api/run] Error:', message);

    return NextResponse.json(
      {
        stdout:   '',
        stderr:   `Server error: ${message}`,
        exitCode: 1,
        status:   'Internal Error',
      },
      { status: 500 }
    );
  }
}