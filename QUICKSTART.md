# DevSphere - Quick Development Guide

## 🚀 Quick Start

### Installation
```bash
npm install
cp env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Where to Find Things

### Adding a New Page
**Location:** `app/[page-name]/page.tsx`

```typescript
'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NewPage() {
  return (
    <main>
      <Navbar />
      <div>Your content</div>
      <Footer />
    </main>
  );
}
```

### Adding a New Component
**Location:** `components/[feature]/[ComponentName].tsx`

```typescript
export default function MyComponent({ prop1, prop2 }) {
  return <div className="...">Content</div>;
}
```

### Adding API Route
**Location:** `app/api/[route]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Your code
    return NextResponse.json({ result: 'success' });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
```

### Adding UI Component
**Location:** `components/ui/[component-name].tsx`

Use Radix UI as base, style with Tailwind CSS

### Adding a Type
**Location:** `types/[feature].ts`

```typescript
export interface MyType {
  id: string;
  value: string;
}
```

### Adding Constants
**Location:** `constants/[feature].ts`

```typescript
export const MY_CONSTANT = { ... };
```

### Adding Hook
**Location:** `hooks/use-[feature].ts`

```typescript
'use client';
export function useMyHook() {
  // state and logic
  return { data, methods };
}
```

---

## 🎨 Styling Guide

### Tailwind CSS Classes
```jsx
// Layout
<div className="flex items-center justify-between gap-4">
  {/* Uses flexbox */}
</div>

// Colors (from Tailwind)
<div className="bg-blue-500 text-white rounded-lg p-4">
  Styled container
</div>

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

// DevSphere Colors
backgroundColor: '#0c1324'  // Dark background
color: '#4ae176'            // Green accent
color: '#d0bcff'            // Purple accent
```

### Custom Classes
Global CSS in `app/globals.css`:
```css
.ds-editor-wrap { ... }
.ds-tab { ... }
.dot-grid { ... }
```

---

## 🔧 Common Tasks

### Run Code Backend Logic
**File:** `app/api/compiler/run/route.ts`

1. Extract code and language from request
2. Validate language is supported
3. Map to Judge0 language ID
4. Submit to Judge0 with timeout limits
5. Poll result up to 12 times
6. Return formatted output

### Debug Code with AI
**File:** `app/api/compiler/debug/route.ts`

1. Extract code, error, language from request
2. Build prompt for Gemini
3. Call Gemini API with fallbacks
4. Return formatted response

### Save User Code
**File:** `lib/savedCodeService.ts`

- `saveCode()` - Save new code
- `list()` - List saved codes
- `deleteCode()` - Delete code
- All use localStorage with key: `devsphere_saved_codes_v1`

### Get User Session
**File:** `lib/localSession.ts`

```typescript
import { getLocalSessionUserId } from '@/lib/localSession';

const userId = getLocalSessionUserId(); // Returns email or null
```

---

## 🎯 State Management

### Using useCompiler Hook
```typescript
import { useCompiler } from '@/hooks/use-compiler';

export default function MyComponent() {
  const {
    langKey,           // Current language
    code,              // Current code
    outputLines,       // Terminal output
    errorItems,        // Errors
    aiLines,           // AI response
    aiState,           // 'idle' | 'thinking' | 'done'
    isRunning,         // Execution status
    activeTab,         // 'output' | 'errors' | 'ai'
    
    // Methods
    setLangKey,
    runCode,
    clearOutput,
    runAIDebug,
  } = useCompiler();

  return (/* JSX */);
}
```

### localStorage API
```typescript
// Session data
localStorage.setItem('isLoggedIn', 'true');
localStorage.getItem('userEmail');

// Saved code
const codes = JSON.parse(localStorage.getItem('devsphere_saved_codes_v1') || '[]');
```

---

## 🌐 API Endpoints

### POST /api/compiler/run
Execute code on Judge0

```js
const response = await fetch('/api/compiler/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'print("hello")',
    language: 'python',
  })
});
const result = await response.json();
// result = { stdout, stderr, compile_output, exitCode, ... }
```

### POST /api/compiler/debug
AI debugging endpoint

```js
const response = await fetch('/api/compiler/debug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'print(x',
    error: 'SyntaxError: unexpected EOF',
    language: 'python',
  })
});
const result = await response.json();
// result = { text: "## Error Explanation..." }
```

---

## 🧪 Testing

### Test Code Compilation
1. Go to `/compiler`
2. Select language
3. Paste code
4. Click Run
5. Check output in Terminal

### Test Saved Projects
1. Write code
2. Click Save
3. Enter title
4. Go to `/saved-projects`
5. Verify code appears

### Test AI Debugging
1. Write code with error
2. Run it
3. Click "Ask AI"
4. Verify explanation appears

---

## 🐛 Debugging Tips

### Browser DevTools
```javascript
// Check session
console.log(localStorage.getItem('isLoggedIn'));
console.log(localStorage.getItem('userEmail'));

// Check saved codes
const codes = JSON.parse(localStorage.getItem('devsphere_saved_codes_v1') || '[]');
console.log(codes);

// Check API keys
console.log(process.env.GEMINI_API_KEY ? 'Gemini key set' : 'Missing!');
console.log(process.env.RAPIDAPI_KEY ? 'RapidAPI key set' : 'Missing!');
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Code won't run | Check API key in .env.local |
| Long timeout | Code takes > 5 seconds, simplify it |
| No AI response | Gemini quota exceeded, wait or upgrade |
| Saved code missing | Check localStorage in DevTools |
| Page won't load | Check console for errors, verify route exists |

---

## 📦 Adding Dependencies

```bash
# Add package
npm install package-name

# Add Radix UI component
npm install @radix-ui/react-component

# Add TypeScript types
npm install --save-dev @types/package-name

# Remove unused packages
npm uninstall package-name
```

---

## 🚢 Deployment

### Build
```bash
npm run build
```

### Production deployment (Netlify)
```bash
npm run build
npm start
```

### Environment Variables (production)
Set in deployment platform dashboard:
- `GEMINI_API_KEY`
- `RAPIDAPI_KEY`

---

## 📋 Checklist for New Features

- [ ] Create component in appropriate folder
- [ ] Add TypeScript types in `types/`
- [ ] Add constants in `constants/` if needed
- [ ] Create API route if backend needed
- [ ] Test on localhost
- [ ] Check browser console for errors
- [ ] Verify localStorage persistence (if applicable)
- [ ] Test responsive design
- [ ] Update documentation
- [ ] Commit changes with clear message

---

## 🔑 Environment Variables

```env
# Google Generative AI
GEMINI_API_KEY=your_key_here

# Optional: Force specific Gemini model
GEMINI_MODEL=gemini-2.5-flash-lite

# RapidAPI (Judge0)
RAPIDAPI_KEY=your_key_here

# Node environment
NODE_ENV=development
```

---

## 📚 Useful Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/docs
- **React Docs:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Judge0 API:** https://rapidapi.com/judge0-official/api/judge0
- **Gemini API:** https://ai.google.dev/docs

---

## 📞 Project Info

- **Name:** DevSphere
- **Version:** 0.1.0
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Status:** Active Development

---

## ⚡ Performance Tips

1. **Use Next.js Image:** Replace `<img>` with `<Image>`
2. **Memoize Components:** Use `React.memo()` for large lists
3. **Lazy Load Routes:** Use dynamic imports for heavy pages
4. **Optimize Bundle:** Remove unused dependencies
5. **Cache API Responses:** Use localStorage wisely
6. **Compress Code:** Minified in production builds

---

## 🔐 Security Reminders

✓ Never commit `.env.local`  
✓ Never hardcode API keys  
✓ Always validate user input  
✓ Use React's built-in XSS protection  
✓ Sanitize code before execution hints  
✓ Use HTTPS in production  
✓ Implement rate limiting for APIs  

---

**Last Updated:** April 2026  
**DevSphere Development Team**
