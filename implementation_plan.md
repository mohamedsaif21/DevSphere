# Finalize DevSphere Compiler UI with Gemini AI

This plan outlines the steps to build the backend functionality of the DevSphere Compiler UI. The execution will be offloaded to robust external apis: **Piston** handling the multi-language code compilation and **Google Gemini** powering the "AI Debug" explanations and Chat. As requested, any fallback or reliance on Anthropic Claude will be completely eliminated to keep the focus solely on Gemini.

## User Review Required

> [!IMPORTANT]
> The setup involves server-side API keys. I will create a `.env.local` to hold the `GEMINI_API_KEY`. You will need to securely provide the actual key on your end or I will initialize it with a placeholder that you can swap out later. Let me know if you would like me to use a specific key value or if you will fill it yourself.

## Proposed Changes

### Configuration & Package Management

#### [NEW] [.env.local](file:///d:/DevSphere/devsphere/.env.local)
- Setup server-only environment variables.
- Add `GEMINI_API_KEY=your_key_here`.

#### [MODIFY] [package.json](file:///d:/DevSphere/devsphere/package.json)
- Run `npm install @google/generative-ai` to ensure the Gemini core SDK is available.

---
### Next.js API Routes

#### [NEW] [route.ts](file:///d:/DevSphere/devsphere/src/app/api/run/route.ts)
- Create new POST endpoint mapping to `/api/run`.
- Receives frontend requests with code, language, version.
- Proxies requests to Piston API (`https://emkc.org/api/v2/piston/execute`) for actual execution and returns output.

#### [NEW] [route.ts](file:///d:/DevSphere/devsphere/src/app/api/debug/route.ts)
- Create new POST endpoint mapping to `/api/debug`.
- Takes `code`, `error`, and `language` to craft an explicit instructional prompt.
- Sends the prompt to `gemini-1.5-flash` via the `@google/generative-ai` library.
- Returns a structured, educational debugging response.

#### [NEW] [route.ts](file:///d:/DevSphere/devsphere/src/app/api/chat/route.ts)
- Create new POST endpoint to handle follow-up queries mapping to `/api/chat`.
- Passes user questions, code, and language context to the Gemini model and returns conversational answers.

---
### Frontend Integration

#### [MODIFY] [useCompiler.ts](file:///d:/DevSphere/devsphere/src/hooks/useCompiler.ts)
- Replace direct API calls to third-party endpoints.
- Update the execution step (usually `fetch('https://emkc.org/...`) to fetch against the internal `/api/run`.
- Update the AI Debug step to fetch against the internal `/api/debug` avoiding any mentions or fallbacks to Anthropic API.
- Ensure state updates (output, error text, AI debug logs) continue functioning properly.

## Open Questions

> [!WARNING]
> Do you already have a `GEMINI_API_KEY` that you'd like me to set in `.env.local`, or should I use a placeholder that you can populate before testing? 

## Verification Plan

### Automated/Manual Verification
- I will run the dev server `npm run dev`.
- Ensure there are no type errors across the newly created Next.js routes.
- Validate that the changes applied to `useCompiler.ts` seamlessly align with the expected request body for the internal API endpoints.
