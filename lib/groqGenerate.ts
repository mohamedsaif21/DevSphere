import Groq from 'groq-sdk';

/**
 * Calls GROQ API with the specified model for code analysis and debugging
 */
export async function generateGroqText(prompt: string, apiKey: string): Promise<string> {
  const client = new Groq({ apiKey });
  
  try {
    const message = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768', // GROQ's powerful fast model
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error('No text response from GROQ');
    }

    return textContent;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`GROQ API error: ${message}`);
  }
}
