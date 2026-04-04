

---

## **Step 1 — Add your API keys**

Create a `.env.local` file in your project root (same level as `package.json`):

`GEMINI_API_KEY=your_key_here`

(Optional) `GEMINI_MODEL=gemini-1.5-flash` — only if you want one model; if unset, the server tries several (1.5 Flash / 8B / lite) when one hits quota.

**Piston (code run):** the public `emkc.org` executor now returns **401** without a token. Add:

`PISTON_API_KEY=your_bearer_token`

(or `PISTON_BEARER_TOKEN`) — obtain access via the Engineer Man / Piston community, or point `PISTON_API_URL` at a **self-hosted** Piston base (e.g. `https://your-host/api/v2/piston`).


These are **server-side only** — never exposed to the browser. Next.js handles this automatically for any key that does NOT start with `NEXT_PUBLIC_`.

![][image1]

---

## **Step 2 — Install the SDK**

npm install @google/generative-ai

---

## **Step 3 — Create `src/app/api/run/route.ts`**

This handles code execution via Piston:

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {  
  const { code, language, version, filename } \= await req.json();

  const res \= await fetch('https://emkc.org/api/v2/piston/execute', {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify({  
      language,  
      version,  
      files: \[{ name: filename, content: code }\],  
    }),  
  });

  const data \= await res.json();  
  return NextResponse.json(data);  
}

---

## **Step 4 — Create `src/app/api/debug/route.ts`**

This is the Gemini AI debug endpoint:

import { NextRequest, NextResponse } from 'next/server';  
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI \= new GoogleGenerativeAI(process.env.GEMINI\_API\_KEY\!);

export async function POST(req: NextRequest) {  
  const { code, error, language } \= await req.json();

  const model \= genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt \= error  
    ? \`You are a coding tutor inside DevSphere. A student wrote this ${language} code and got an error.  
Explain clearly:  
1\. What the error means in simple words  
2\. Why it happened    
3\. How to fix it with corrected code

Code:  
\\\`\\\`\\\`  
${code}  
\\\`\\\`\\\`

Error:  
${error}

Be concise, friendly, and educational.\`  
    : \`You are a coding tutor inside DevSphere. Review this ${language} code:  
1\. Explain what it does  
2\. Point out issues or improvements  
3\. Show improved version if needed

Code:  
\\\`\\\`\\\`  
${code}  
\\\`\\\`\\\`\`;

  const result \= await model.generateContent(prompt);  
  const text \= result.response.text();

  return NextResponse.json({ text });  
}

---

## **Step 5 — Create `src/app/api/chat/route.ts`**

This lets users ask follow-up questions about their code:

import { NextRequest, NextResponse } from 'next/server';  
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI \= new GoogleGenerativeAI(process.env.GEMINI\_API\_KEY\!);

export async function POST(req: NextRequest) {  
  const { question, code, language } \= await req.json();

  const model \= genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt \= \`You are a helpful coding tutor in DevSphere.  
The user is working with this ${language} code:  
\\\`\\\`\\\`  
${code}  
\\\`\\\`\\\`  
User's question: ${question}  
Answer concisely and helpfully.\`;

  const result \= await model.generateContent(prompt);  
  const text \= result.response.text();

  return NextResponse.json({ text });  
}

---

## **Step 6 — Update `useCompiler.ts` to call your own API**

Replace the direct external fetch calls in your hook with calls to your own backend:

// Instead of calling Piston directly:  
const res \= await fetch('/api/run', {  
  method: 'POST',  
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify({  
    code: trimmed,  
    language: cfg.pistonLang,  
    version: cfg.pistonVersion,  
    filename: cfg.file,  
  }),  
});

// Instead of calling Anthropic/Gemini directly:  
const res \= await fetch('/api/debug', {  
  method: 'POST',  
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify({ code, error: errorText, language: cfg.name }),  
});  
const data \= await res.json();  
// data.text contains Gemini's response

---

## **Final folder structure for your new API files**

src/app/api/  
├── run/  
│   └── route.ts      ← Piston code execution  
├── debug/  
│   └── route.ts      ← Gemini AI debug  
└── chat/  
    └── route.ts      ← Gemini chat questions

---



