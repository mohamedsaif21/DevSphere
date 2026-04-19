# DevSphere - Architecture & System Design

## System Architecture Diagram

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      USER INTERFACE LAYER                          ┃
┃                                                                    ┃
┃  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐              ┃
┃  │   Login     │  │    Home      │  │  Compiler   │              ┃
┃  │   Page      │  │    Page      │  │   Page      │              ┃
┃  └─────────────┘  └──────────────┘  └─────────────┘              ┃
┃                                           │                       ┃
┃                                           ├─ CodeEditor           ┃
┃                                           ├─ CompilerHeader       ┃
┃                                           ├─ TerminalPanel        ┃
┃                                           ├─ StatusBar            ┃
┃                                           └─ SaveCodeModal        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
        ┌──────────────────┐  ┌────────────────────┐
        │  useCompiler     │  │ savedCodeService   │
        │  (State Mgmt)    │  │ (LocalStorage)     │
        └────────┬─────────┘  └────────────────────┘
                 │
        ┌────────▼────────────────────────┐
        │  fetch() Calls to API Routes    │
        └─┬──────────────────────────────┬┘
          │                              │
         ▼                              ▼
    ┌─────────────┐              ┌──────────────┐
    │ /api/       │              │ /api/        │
    │ compiler/run│              │ compiler/    │
    │             │              │ debug        │
    └──────┬──────┘              └──────┬───────┘
           │                            │
           ▼                            ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  JUDGE0 API (RapidAPI)     ┃  ┃  GEMINI API (Google) ┃
┃                             ┃  ┃                      ┃
┃  • Compilation              ┃  ┃  • AI Analysis       ┃
┃  • Execution                ┃  ┃  • Error Diagnosis   ┃
┃  • Output Capture           ┃  ┃  • Code Review       ┃
┃  • Error Handling           ┃  ┃  • Explanations      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━━━━━━┛
           │                            │
           └────────────┬───────────────┘
                        ▼
                  ┌──────────────┐
                  │  Response    │
                  │  Formatting  │
                  └──────┬───────┘
                         ▼
                ┌──────────────────────┐
                │  Display in UI       │
                │  TerminalPanel/Tabs  │
                └──────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
START
  │
  ▼
┌──────────────────────────────┐
│  User visits localhost:3000  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Root page (/) checks localStorage   │
│  Key: "isLoggedIn"                   │
└────────┬─────────────────────────────┘
         │
         ├──YES─────────────┐
         │                  ▼
         │          ┌──────────────────┐
         │          │ Redirect to /home│
         │          │ (Dashboard)      │
         │          └──────────────────┘
         │
         ├──NO──────────────┐
         │                  ▼
         │          ┌────────────────────┐
         │          │ Redirect to /login │
         │          │ (Login Page)       │
         │          └─────┬──────────────┘
         │                │
         │                ▼
         │          ┌────────────────────────┐
         │          │ User enters email &    │
         │          │ password               │
         │          └─────┬──────────────────┘
         │                │
         │                ▼
         │          ┌────────────────────────┐
         │          │ Click "Login"          │
         │          │ Frontend waits 800ms   │
         │          └─────┬──────────────────┘
         │                │
         │                ▼
         │          ┌────────────────────────┐
         │          │ Save to localStorage:  │
         │          │ • isLoggedIn = 'true'  │
         │          │ • userEmail = email    │
         │          └─────┬──────────────────┘
         │                │
         └────────────────┼──────────────────┐
                          │                  │
                          ▼                  ▼
                    ┌──────────────────┐  ALLOWED
                    │ Redirect to /home│
                    │ (Dashboard)      │
                    └──────────────────┘
                          │
                          ▼
                        END
```

### 2. Code Execution Flow

```
User in /compiler page
  │
  ▼
┌──────────────────────────┐
│ User enters code         │
│ Selects language:        │
│ • Python                 │
│ • Java                   │
│ • C                      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Clicks "Run" button      │
│ useCompiler.runCode()    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend validation:             │
│ • Code not empty?                │
│ • Language selected?             │
└──────┬──────────┬────────────────┘
       │ FAIL     │ PASS
       ▼          ▼
    ERROR    ┌─────────────────────────────┐
             │ POST /api/compiler/run      │
             │ {                           │
             │   code: string              │
             │   language: 'python'|...    │
             │ }                           │
             └────────┬────────────────────┘
                      │
                      ▼
       ┌──────────────────────────────────┐
       │ Backend validates & maps         │
       │ Language ID mapping:             │
       │ • python → 71                    │
       │ • java → 62                      │
       │ • c → 50                         │
       └────┬──────────────────────┬──────┘
            │                      │
            │ INVALID              │ VALID
            ▼                      ▼
         Return 400         ┌─────────────────────┐
         Error              │ Call Judge0 API     │
                            │ POST /submissions   │
                            └────────┬────────────┘
                                     │
                                     ▼
                            ┌─────────────────────────┐
                            │ Judge0 returns TOKEN    │
                            │ (async submission)      │
                            └────────┬────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │ Poll for results (max 12 times)│
                    │ GET /submissions/{token}       │
                    │ Wait 1 sec between polls       │
                    └────┬──────────────────┬────────┘
                         │                  │
                    TIMEOUT            SUCCESS
                    (12 loops)         (status ≥ 3)
                         │                  │
                         ▼                  ▼
                    Return            ┌──────────────────┐
                    Timeout           │ Extract output:  │
                    Error             │ • stdout         │
                                      │ • stderr         │
                                      │ • compile_output │
                                      │ • exit_code      │
                                      └────────┬─────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ Return to Frontend   │
                                    │ 200 OK with results  │
                                    └────────┬─────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │ Frontend receives        │
                              │ Update state:            │
                              │ • outputLines[]          │
                              │ • errorItems[]           │
                              │ • isRunning = false      │
                              └────────┬────────────────┘
                                       │
                                       ▼
                            ┌──────────────────────────┐
                            │ Render TerminalPanel     │
                            │ Display results to user  │
                            └──────────────────────────┘
```

### 3. AI Debugging Flow

```
Code Execution completes with ERROR
  │
  ▼
┌──────────────────────┐
│ Error appears in     │
│ Terminal Panel       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ User clicks "Ask AI"         │
│ or error occurs & AI auto-run│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend prepares prompt:        │
│ {                                │
│   code: <user_code>              │
│   error: <error_message>         │
│   language: 'python' | ...       │
│ }                                │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/compiler/debug         │
├──────────────────────────────────┤
│ Set aiState = 'thinking'         │
│ Disable UI interactions          │
└──────┬──────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Backend creates detailed prompt:       │
│ "You are a coding tutor..."            │
│ "Explain the error clearly:"           │
│ "1. What does it mean?"                │
│ "2. Why did it happen?"                │
│ "3. How to fix it?"                    │
│ + code snippet                         │
│ + error message                        │
└──────┬───────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Call Gemini API (multi-model fallback):│
│ Try: gemini-1.5-flash                  │
│ Catch error? → Try: gemini-1.5-flash-8b│
│ Catch error? → Try: gemini-2.5-...     │
└──────┬────────────┬────────────────────┘
       │            │
    SUCCESS      FAILURE
       │            │
       ▼            ▼
   ┌────────┐   ┌──────────────┐
   │ RESPONSE│   │ Return Error │
   │ from    │   │ Message      │
   │ Gemini  │   └──────────────┘
   └────┬───┘         │
       │              ▼
       │       Frontend shows
       │       error in AI tab
       │
       ▼
┌────────────────────────────────┐
│ Parse Gemini response:         │
│ Format as markdown with:       │
│ • Titles (##)                  │
│ • Code blocks (```)            │
│ • Text explanation             │
│ • Spacing                      │
└──────┬────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Return to Frontend:            │
│ {                              │
│   text: <formatted_response>   │
│ }                              │
└──────┬────────────────────────┘
       │
       ▼
┌────────────────────────────────┐
│ Frontend processes:            │
│ • Parse response text          │
│ • Extract AILine[] objects:    │
│   - title                      │
│   - text                       │
│   - code                       │
│   - spacer                     │
│ • Set aiState = 'done'         │
│ • Update aiLines[]             │
└──────┬────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Render in "AI" tab:                │
│ • Display formatted explanation    │
│ • Show code suggestions            │
│ • Enable user to read analysis     │
└────────────────────────────────────┘
```

### 4. Code Saving Flow

```
User in /compiler page
  │
  ▼
┌──────────────────────┐
│ Clicks "Save"        │
│ icon/button          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ SaveCodeModal pops up:           │
│ Input fields:                    │
│ • title (required)               │
│ • description (optional)         │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ User enters data & clicks "Save" │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend validation:             │
│ • title not empty?               │
│ • language selected?             │
└──────┬──────────────┬───────────┘
       │ FAIL         │ PASS
       ▼              ▼
    SHOW ERROR   ┌──────────────────────────┐
                 │ Call saveCode():         │
                 │ • Generate UUID          │
                 │ • Create SavedCode obj:  │
                 │   id: UUID               │
                 │   user_id: email         │
                 │   title: input_title     │
                 │   language: 'python'     │
                 │   code: current_code     │
                 │   description: input_desc│
                 │   created_at: now        │
                 │   updated_at: now        │
                 └──────┬──────────────────┘
                        │
                        ▼
       ┌────────────────────────────────┐
       │ localStorage operations:       │
       │ 1. Read existing array from:   │
       │    Key: devsphere_saved_codes_v1│
       │ 2. Push new SavedCode object   │
       │ 3. Write back to localStorage  │
       └──────┬────────────┬───────────┘
              │            │
           FAIL         SUCCESS
              │            │
              ▼            ▼
          ┌────────┐   ┌────────────────────┐
          │ Show   │   │ Show success toast │
          │ error  │   │ notification       │
          │ toast  │   └────┬───────────────┘
          └────────┘        │
                            ▼
                      ┌────────────────────┐
                      │ Close SaveCodeModal│
                      │ Clear form inputs  │
                      │ Reset aiState      │
                      └────────┬───────────┘
                               │
                               ▼
                      ┌────────────────────┐
                      │ User can now view  │
                      │ project in         │
                      │ /saved-projects    │
                      └────────────────────┘
```

---

## Component Hierarchy

```
<RootLayout> [app/layout.tsx]
│
├─ <Root Page> [app/page.tsx]
│  └─ Redirect logic
│
├─ <Login Page> [app/login/page.tsx]
│  ├─ Hero section
│  ├─ Features display
│  └─ Login form
│
├─ <Register Page> [app/register/page.tsx]
│  └─ Register form
│
├─ <Home Page> [app/home/page.tsx]
│  ├─ <Navbar>
│  ├─ <HeroSection>
│  ├─ <FeaturesSection>
│  ├─ <CTASection>
│  ├─ <PerformanceSection>
│  ├─ <IDEMockup>
│  ├─ <project> (multiple)
│  └─ <Footer>
│
├─ <Compiler Page> [app/compiler/page.tsx]
│  ├─ <Navbar>
│  ├─ <CompilerHeader>
│  │  ├─ Language selector
│  │  ├─ Run button
│  │  ├─ Clear button
│  │  └─ Save button
│  ├─ <CodeEditor>
│  │  ├─ Line numbers
│  │  └─ Textarea
│  ├─ <TerminalPanel>
│  │  ├─ Output tab
│  │  ├─ Errors tab
│  │  └─ AI tab
│  ├─ <StatusBar>
│  │  ├─ Execution time
│  │  ├─ Memory usage
│  │  └─ Status message
│  ├─ <SaveCodeModal>
│  └─ <Footer>
│
├─ <Saved Projects Page> [app/saved-projects/page.tsx]
│  ├─ <Navbar>
│  ├─ Project list
│  ├─ Project cards
│  ├─ Edit/Delete actions
│  └─ <Footer>
│
└─ <UI Components> [components/ui/]
   ├─ Button, Dialog, Form
   ├─ Tabs, Input, Textarea
   ├─ Alert, Toast, Badge
   └─ ... (20+ components)
```

---

## State Management Architecture

### Global State (useCompiler Hook)

```
useCompiler Hook State:
├─ langKey: 'python' | 'java' | 'c'
├─ code: string
├─ outputLines: OutputLine[]
│  └─ { text: string, type: 'output'|'error'|'info'|'prompt' }
├─ errorItems: ErrorItem[]
│  └─ { message: string, isError: boolean }
├─ aiLines: AILine[]
│  └─ { text: string, type: 'title'|'text'|'code'|'spacer' }
├─ aiState: 'idle' | 'thinking' | 'done' | 'error'
├─ isRunning: boolean
├─ activeTab: 'output' | 'errors' | 'ai'
└─ errorCount: number

Methods:
├─ setLangKey(key)
├─ runCode()
├─ clearOutput()
├─ appendOutputLines()
├─ pushOutputLine()
├─ runAIDebug()
└─ ... (more methods)
```

### Local Storage State

```
Session Storage:
├─ isLoggedIn: 'true' | undefined
└─ userEmail: 'user@example.com' | undefined

Code Storage:
└─ devsphere_saved_codes_v1: SavedCode[]
```

---

## Type System

### Core Types

```typescript
// Language Support
type LanguageKey = 'python' | 'java' | 'c';

// Language Configuration
interface LanguageConfig {
  name: string;                 // Display name
  file: string;                 // Default filename
  pistonLang: string;          // Execution engine ID
  pistonVersion: string;       // Runtime version
  color: string;               // UI color code
  starter: string;             // Template code
}

// API Response from Judge0
interface PistonResponse {
  run?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  },
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  }
}

// Terminal Tabs
type TerminalTab = 'output' | 'errors' | 'ai';

// Output Lines
interface OutputLine {
  text: string;
  type: 'output' | 'error' | 'info' | 'prompt';
}

// Error Items
interface ErrorItem {
  message: string;
  isError: boolean;
}

// AI Response
interface AIResponse {
  lines: AILine[];
}

interface AILine {
  text: string;
  type: 'title' | 'text' | 'code' | 'spacer';
}

// Saved Code
interface SavedCode {
  id?: string;
  user_id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## Request/Response Examples

### Example 1: Run Python Code

**Request:**
```http
POST /api/compiler/run
Content-Type: application/json

{
  "code": "print('Hello, World!')\nprint(2 + 2)",
  "language": "python"
}
```

**Response (200 OK):**
```json
{
  "stdout": "Hello, World!\n4\n",
  "stderr": "",
  "compile_output": "",
  "exitCode": 0,
  "time": 0.152,
  "memory": 8572,
  "status": "Success"
}
```

### Example 2: Syntax Error with AI

**Request:**
```http
POST /api/compiler/debug
Content-Type: application/json

{
  "code": "def greet(name\n    return f\"Hello {name}\"",
  "error": "SyntaxError: unexpected EOF while parsing",
  "language": "python"
}
```

**Response (200 OK):**
```json
{
  "text": "## Syntax Error Found!\n\n### What the Error Means\nYou have an unclosed parenthesis on line 1...\n\n### Why It Happened\nPython expected a closing `)` but reached the end of file...\n\n### How to Fix It\n\n```python\ndef greet(name):\n    return f\"Hello {name}\"\n```\n\nThe corrected code now has the closing parenthesis."
}
```

---

## Error Handling Strategy

```
Frontend Error Handling:
├─ Validation errors
│  ├─ Show toast notification
│  └─ Prevent API call
├─ Network/API errors
│  ├─ Display error message
│  ├─ Show retry button
│  └─ Log to console
└─ Runtime errors
   ├─ Show in output panel
   ├─ Offer AI debugging
   └─ User can fix code

Backend Error Handling:
├─ Validation
│  ├─ Check for missing fields
│  └─ Return 400 Bad Request
├─ Configuration
│  ├─ Check for API keys
│  └─ Return 500 Server Error
├─ External APIs
│  ├─ Try fallback models
│  ├─ Timeout handling
│  └─ Return 500 on failure
└─ Execution errors
   ├─ Capture stderr/compile_output
   └─ Return as part of response
```

---

## Performance Considerations

```
Frontend:
├─ Component lazy loading
├─ Textarea virtualization for large code
├─ Debounced scroll handlers
├─ Memoized components
└─ CSS-in-JS for dynamic styling

Backend:
├─ Polling instead of WebSockets (simpler)
├─ API key validation once at startup
├─ Error isolation (doesn't crash server)
├─ Timeout protection (12-second max)
└─ Memory limit enforced by Judge0

User Experience:
├─ Immediate visual feedback (loading state)
├─ Status bar shows execution time
├─ Toast notifications for actions
├─ Responsive design for all screens
└─ Graceful fallbacks for API failures
```

---

## Security Considerations

```
✓ Frontend:
  • localStorage limited to browser
  • No sensitive data exposed
  • CSRF protection (SameSite cookies)
  • XSS prevention (React escapes by default)

✓ Backend:
  • API keys in environment variables
  • No keys in source code
  • Validated input before forwarding
  • Error messages don't expose internals

⚠ To Improve:
  • Add real authentication (JWT/OAuth)
  • Hash/encrypt stored user data
  • Rate limiting on API endpoints
  • Code execution sandbox verification
  • HTTPS-only in production
  • CSP headers
  • Input sanitization
```

---

**Generated:** April 2026  
**DevSphere v0.1.0**
