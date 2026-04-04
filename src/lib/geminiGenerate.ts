import { GoogleGenerativeAI } from '@google/generative-ai';

function shouldTryNextModel(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err);
  return /429|Too Many Requests|quota|RESOURCE_EXHAUSTED|limit:\s*0|404|not found|is not found|invalid model|NOT_FOUND/i.test(
    m
  );
}

/**
 * Calls Gemini with GEMINI_MODEL if set; otherwise tries models that often
 * still have free-tier quota before wider 2.x defaults.
 */
export async function generateGeminiText(prompt: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const explicit = process.env.GEMINI_MODEL?.trim();
  const chain = explicit
    ? [explicit]
    : ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.5-flash-lite'];

  let last: unknown;
  for (const modelId of chain) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      last = e;
      if (explicit || !shouldTryNextModel(e)) break;
    }
  }
  throw last;
}
