import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/geminiGenerate';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { code, error, language } = body as {
      code?: string;
      error?: string | null;
      language?: string;
    };

    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Missing or empty code.' }, { status: 400 });
    }

    const lang = typeof language === 'string' ? language : 'code';

    const prompt = error
      ? `You are a coding tutor inside DevSphere. A student wrote this ${lang} code and got an error.\nExplain clearly:\n1. What the error means in simple words\n2. Why it happened\n3. How to fix it with corrected code\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nError:\n${error}\n\nBe concise, friendly, and educational.`
      : `You are a coding tutor inside DevSphere. Review this ${lang} code:\n1. Explain what it does\n2. Point out issues or improvements\n3. Show improved version if needed\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nBe concise, friendly, and educational.`;

    const text = await generateGeminiText(prompt, apiKey);

    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error('Error in /api/compiler/debug:', err);
    const message = err instanceof Error ? err.message : 'Failed to get analysis from Gemini';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
