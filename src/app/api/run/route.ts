import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PISTON_EXECUTE = 'https://emkc.org/api/v2/piston/execute';

function pistonExecuteUrl(): string {
  const raw = process.env.PISTON_API_URL?.trim();
  if (!raw) return DEFAULT_PISTON_EXECUTE;
  const u = raw.replace(/\/$/, '');
  return u.endsWith('/execute') ? u : `${u}/execute`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, version, filename } = body as {
      code?: string;
      language?: string;
      version?: string;
      filename?: string;
    };

    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Missing or empty code.' }, { status: 400 });
    }
    if (typeof language !== 'string' || typeof version !== 'string') {
      return NextResponse.json({ error: 'Missing language or version.' }, { status: 400 });
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = process.env.PISTON_API_KEY?.trim() || process.env.PISTON_BEARER_TOKEN?.trim();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = pistonExecuteUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language,
        version,
        files: [{ name: filename || 'main', content: code }],
      }),
    });

    const data = (await res.json()) as Record<string, unknown>;

    if (res.status === 401) {
      return NextResponse.json(
        {
          error: 'Piston rejected the request (401). The public emkc.org API now requires a Bearer token.',
          hint:
            'Add PISTON_API_KEY to .env.local (token from Engineer Man / Piston — see github.com/engineer-man/emkc), or set PISTON_API_URL to your self-hosted Piston execute URL.',
          detail: data,
        },
        { status: 401 }
      );
    }

    if (!res.ok) {
      const pistonMsg =
        typeof data.message === 'string'
          ? data.message
          : typeof (data as { error?: string }).error === 'string'
            ? (data as { error: string }).error
            : `HTTP ${res.status}`;
      return NextResponse.json(
        {
          error: `Piston request failed: ${pistonMsg}`,
          detail: data,
        },
        { status: res.status >= 400 ? res.status : 502 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/run:', error);
    return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 });
  }
}
