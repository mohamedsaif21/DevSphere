# DevSphere - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Architecture & Data Flow](#architecture--data-flow)
5. [Key Features](#key-features)
6. [Components Overview](#components-overview)
7. [API Routes](#api-routes)
8. [Environment Configuration](#environment-configuration)
9. [Development Setup](#development-setup)
10. [How It Works](#how-it-works)
11. [Data Persistence](#data-persistence)
12. [External Services](#external-services)

---

## Project Overview

**DevSphere** is a modern, cloud-based code compiler and IDE built for developers who want to write, execute, and debug code online. It's designed with a focus on speed, precision, and AI-driven development.

### Core Purpose
- **Write Code**: Support for multiple programming languages (Python, Java, C)
- **Execute Code**: Run code with real-time output
- **Debug Code**: AI-powered debugging and code analysis
- **Save Projects**: Store code snippets locally with project management
- **User Authentication**: Simple login/registration system

### Project Name
**DevSphere** — "Code faster. Debug smarter. Build better."

### Target Users
- Students learning to code
- Developers wanting a quick online IDE
- Editorial engineers and technical writers
- Anyone needing a cloud-based compiler

---

## Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### UI Components & Libraries
- **Radix UI** - Headless component system
  - Dialog, Tabs, Forms, Buttons, etc. (20+ components)
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form state management
- **CMDk** - Command/search palette
- **Clsx** - Class name utilities

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Backend & API
- **Next.js API Routes** - Serverless functions
- **Node.js** - Backend runtime

### External Services
1. **Judge0 API** (via RapidAPI) - Code Execution Engine
   - Compiles and runs Python, Java, C code
   - Handles code submission, compilation, and output

2. **Google Generative AI (Gemini)** - AI Debugging
   - Code analysis and error explanation
   - Educational feedback on code

### Build & Deployment
- **Netlify** - Deployment platform (Next.js plugin)
- **SWC WASM** - Rust-based JavaScript compiler

---

## Folder Structure

```
Devsphere/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Root page (redirects to login/home)
│   ├── globals.css              # Global styles
│   ├── api/                     # API routes
│   │   └── compiler/
│   │       ├── run/
│   │       │   └── route.ts     # Code execution endpoint
│   │       └── debug/
│   │           └── route.ts     # AI debugging endpoint
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── register/
│   │   └── page.tsx             # Registration page
│   ├── compiler/
│   │   └── page.tsx             # Main compiler/IDE page
│   ├── home/
│   │   └── page.tsx             # Home/dashboard page
│   └── saved-projects/
│       └── page.tsx             # Saved code management page
│
├── components/                   # React components
│   ├── Navbar.tsx               # Top navigation
│   ├── Footer.tsx               # Footer component
│   ├── ui/                      # Reusable UI components (Radix UI)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── input.tsx
│   │   └── ... (20+ UI components)
│   ├── compiler/                # Compiler-specific components
│   │   ├── CodeEditor.tsx       # Code editor with line numbers
│   │   ├── CompilerHeader.tsx   # Header with language selector
│   │   ├── TerminalPanel.tsx    # Output/error/AI response display
│   │   ├── StatusBar.tsx        # Status information display
│   │   └── SaveCodeModal.tsx    # Save code dialog
│   └── home/                    # Home page components
│       ├── HeroSection.tsx      # Main hero content
│       ├── FeaturesSection.tsx  # Features overview
│       ├── CTASection.tsx       # Call-to-action section
│       ├── PerformanceSection.tsx
│       ├── IDEMockup.tsx        # IDE preview
│       └── project.tsx          # Project cards
│
├── constants/                   # Configuration constants
│   └── languages.ts            # Language configuration (Python, Java, C)
│
├── hooks/                       # React custom hooks
│   ├── use-compiler.ts         # Compiler state management
│   └── use-toast.ts            # Toast notification hook
│
├── lib/                         # Utility functions and services
│   ├── geminiGenerate.ts       # Google Gemini API integration
│   ├── savedCodeService.ts     # Code persistence layer
│   ├── localSession.ts         # Local session management
│   └── utils.ts                # General utilities
│
├── types/                       # TypeScript type definitions
│   ├── compiler.ts             # Compiler-related types
│   └── savedCode.ts            # SavedCode interface
│
├── utils/                       # Utility functions
│   └── compiler-helpers.ts     # Compiler helper functions
│
├── docs/                        # Documentation directory
│
├── Configuration Files
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS config
│   ├── tsconfig.json           # TypeScript config
│   ├── postcss.config.js       # PostCSS config
│   ├── components.json         # Shadcn component manifest
│   ├── .eslintrc.json          # ESLint configuration
│   └── package.json            # Dependencies and scripts
│
└── Environment & Build
    ├── .env.example            # Example environment variables
    ├── .env.local              # Local environment (gitignored)
    ├── .gitignore              # Git ignore rules
    └── next-env.d.ts           # Next.js type definitions
```

---

## Architecture & Data Flow

### 1. **User Authentication Flow**
```
User Lands on Site
    ↓
Root Page (/) checks localStorage
    ↓
Is Logged In? 
    → YES: Redirect to /home
    ↓ NO
Redirect to /login
    ↓
Login Form (persist email & isLoggedIn flag)
    ↓
localStorage: { isLoggedIn: 'true', userEmail: 'user@example.com' }
    ↓
Redirect to /home
```

### 2. **Code Execution Flow**
```
User enters code in /compiler
    ↓
Selects language (Python/Java/C)
    ↓
Clicks "Run" button
    ↓
Frontend sends code to /api/compiler/run
    ↓
Backend maps language to Judge0 API
    ↓
Judge0 compiles & executes code
    ↓
Polls for results (up to 12 seconds)
    ↓
Returns stdout/stderr/compile_output
    ↓
Frontend displays in TerminalPanel
```

### 3. **AI Debugging Flow**
```
Code execution results in error
    ↓
User clicks "Ask AI" or error occurs
    ↓
Frontend sends code + error to /api/compiler/debug
    ↓
Backend calls Google Generative AI (Gemini)
    ↓
Gemini returns analysis/explanation
    ↓
Frontend parses and displays in AI tab
```

### 4. **Code Saving Flow**
```
User clicks "Save" in compiler
    ↓
SaveCodeModal appears
    ↓
User enters title, description
    ↓
Frontend calls saveCode() from savedCodeService
    ↓
Saves to localStorage: devsphere_saved_codes_v1
    ↓
Data structure: SavedCode interface stored as JSON array
    ↓
User can view/manage in /saved-projects
```

---

## Key Features

### 1. **Multi-Language Support**
- **Python 3.10.0**
  - Starter template includes basic functions and loops
  - Full standard library available
  
- **Java 15.0.2**
  - Full JVM compilation
  - Starter template with Main class
  
- **C 10.2.0**
  - Standard C compilation
  - Includes standard libraries

### 2. **Real-Time Code Editor**
- Syntax highlighting support
- Line number display
- Tab support (converts Tab to 4 spaces)
- Synchronized scrolling
- Auto scroll tracking

### 3. **Execution Engine**
- Asynchronous code execution
- 5-second CPU time limit per execution
- 128MB memory limit
- Real-time output streaming
- Error and warning capture

### 4. **AI-Powered Debugging**
- Error explanation service
- Code review and suggestions
- Multi-model fallback (Gemini 1.5 Flash, 2.5 Flash Lite)
- Educational feedback

### 5. **Project Management**
- Save code snippets locally
- Organize by title, language, description
- Automatic timestamps
- UUID-based project IDs
- Local storage persistence

### 6. **User Dashboard**
- Home page with features overview
- Navigation between compiler and projects
- Responsive design for all devices
- Modern UI with gradient effects

---

## Components Overview

### Navigation & Layout
| Component | Purpose | Location |
|-----------|---------|----------|
| `Navbar` | Top navigation menu | `components/Navbar.tsx` |
| `Footer` | Footer with branding | `components/Footer.tsx` |

### Compiler Components
| Component | Purpose | Location |
|-----------|---------|----------|
| `CodeEditor` | Main code input textarea | `components/compiler/CodeEditor.tsx` |
| `CompilerHeader` | Language selector, Run button | `components/compiler/CompilerHeader.tsx` |
| `TerminalPanel` | Output, errors, AI response tabs | `components/compiler/TerminalPanel.tsx` |
| `StatusBar` | Execution time, memory usage | `components/compiler/StatusBar.tsx` |
| `SaveCodeModal` | Save project dialog | `components/compiler/SaveCodeModal.tsx` |

### Home Page Components
| Component | Purpose | Location |
|-----------|---------|----------|
| `HeroSection` | Main banner | `components/home/HeroSection.tsx` |
| `FeaturesSection` | Feature highlights | `components/home/FeaturesSection.tsx` |
| `CTASection` | Call-to-action buttons | `components/home/CTASection.tsx` |
| `PerformanceSection` | Performance metrics | `components/home/PerformanceSection.tsx` |
| `IDEMockup` | IDE preview visual | `components/home/IDEMockup.tsx` |
| `project` | Project cards display | `components/home/project.tsx` |

### UI Components (20+ Radix UI based)
All in `components/ui/` - Button, Dialog, Form, Tabs, Input, Textarea, etc.

---

## API Routes

### 1. **Code Execution Endpoint**
**Route:** `POST /api/compiler/run`

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

**Response:**
```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "compile_output": "",
  "exitCode": 0,
  "time": 0.123,
  "memory": 12345,
  "status": "Success"
}
```

**Process:**
1. Validates code and language
2. Maps language to Judge0 language ID (Python: 71, Java: 62, C: 50)
3. Submits to Judge0 API
4. Polls for result (max 12 retries, 1-second intervals)
5. Returns formatted output

**Error Handling:**
- Returns 400 for missing code/language
- Returns 500 for API key issues
- Returns execution errors in `stderr`

---

### 2. **AI Debugging Endpoint**
**Route:** `POST /api/compiler/debug`

**Request Body:**
```json
{
  "code": "print('test'",
  "error": "SyntaxError: unexpected EOF while parsing",
  "language": "python"
}
```

**Response:**
```json
{
  "text": "## What the Error Means\n\nYou have an unclosed parenthesis...\n\n## Why It Happened\n\n... [detailed explanation]"
}
```

**Features:**
- Multi-model fallback (tries multiple Gemini versions)
- Graceful degradation if quota exceeded
- Educational tone and explanations

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Generative AI (Gemini API)
GEMINI_API_KEY=your_gemini_api_key

# Optional: Specify which Gemini model to use
GEMINI_MODEL=gemini-2.5-flash-lite

# RapidAPI (Judge0 Code Execution)
RAPIDAPI_KEY=your_rapidapi_key

# Next.js
NODE_ENV=development
```

### Getting API Keys

**Google Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. Save to `GEMINI_API_KEY`

**RapidAPI (Judge0):**
1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to Judge0 API
3. Get API key from dashboard
4. Save to `RAPIDAPI_KEY`

---

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Devsphere

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local

# Add your API keys to .env.local
```

### Scripts
```bash
# Development server (runs on localhost:3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code
npm lint

# Type check
npm run typecheck
```

### Development Workflow
1. **Frontend Development:**
   - Edit components in `/components`
   - Edit pages in `/app`
   - Styles update automatically with Tailwind

2. **Adding API Routes:**
   - Create files in `/app/api`
   - Export POST/GET handlers
   - Access via `fetch('/api/...')`

3. **Adding UI Components:**
   - Use Radix UI components from `components/ui/`
   - Or create custom components in `components/`

4. **Type Safety:**
   - Define types in `/types`
   - Use TypeScript for all files
   - Run `npm run typecheck` before committing

---

## How It Works

### 1. **Initial Load**
```
Browser loads localhost:3000
→ Root page checks localStorage.isLoggedIn
→ If false, redirects to /login
→ If true, redirects to /home
```

### 2. **User Login (No Backend)**
```
User enters email and password
→ Clicks Login
→ Frontend stores in localStorage:
   - isLoggedIn: 'true'
   - userEmail: user@example.com
→ Redirected to /home
```

### 3. **Writing Code**
```
User navigates to /compiler
→ Selects language from dropdown
→ CodeEditor loads with starter template
→ User edits code in textarea
→ Line numbers auto-update
```

### 4. **Executing Code**
```
User clicks "Run"
→ useCompiler hook extracts code and language
→ Sends to /api/compiler/run
→ Backend calls Judge0 API
→ Polls for result
→ Returns stdout/stderr
→ Frontend appends to output lines
→ TerminalPanel displays results
```

### 5. **Debugging with AI**
```
Execution returns error
→ User clicks "Ask AI"
→ Sends code + error to /api/compiler/debug
→ Gemini analyzes and returns explanation
→ Frontend parses markdown-like format
→ Displays in AI tab with formatting
```

### 6. **Saving Projects**
```
User clicks "Save"
→ SaveCodeModal opens
→ User enters title and description
→ Clicks "Save" button
→ Frontend calls saveCode() function
→ Generates UUID for project
→ Stores in localStorage as JSON
→ Shows success notification
```

### 7. **Viewing Saved Projects**
```
User navigates to /saved-projects
→ Page fetches from localStorage
→ Displays list of saved code
→ User can view/edit/delete projects
```

---

## Data Persistence

### Client-Side Storage (localStorage)

**1. Session Data:**
```
Key: isLoggedIn
Value: 'true' | undefined

Key: userEmail
Value: 'user@example.com' | undefined
```

**2. Saved Code:**
```
Key: devsphere_saved_codes_v1
Value: Array of SavedCode objects
```

**SavedCode Structure:**
```typescript
interface SavedCode {
  id: string;              // UUID
  user_id: string;         // User email
  title: string;           // Project title
  language: string;        // 'python' | 'java' | 'c'
  code: string;            // Full source code
  description?: string;    // Optional description
  created_at: string;      // ISO date
  updated_at: string;      // ISO date
}
```

### No Backend Database
- Currently uses **localStorage only**
- All data persists in browser, not synced to server
- Future: Can integrate with database (Supabase, Firebase, MySQL, etc.)

---

## External Services

### 1. **Judge0 API** (Code Execution)
- **Endpoint:** `https://judge029.p.rapidapi.com`
- **Features:**
  - Compiles and executes code
  - Supports 60+ languages
  - Returns stdout, stderr, compile output
  
- **Usage Process:**
  1. Submit code → Get token
  2. Poll status with token → Get results
  3. Parse and return to frontend

- **Limits:**
  - 5 second CPU time per execution
  - 128MB memory per execution

### 2. **Google Generative AI (Gemini)**
- **Endpoint:** `https://generativelanguage.googleapis.com`
- **Models:**
  - Primary: gemini-1.5-flash
  - Fallback: gemini-1.5-flash-8b, gemini-2.5-flash-lite

- **Usage Process:**
  1. Build prompt with code and error
  2. Call Gemini API
  3. Parse response and return to frontend
  
- **Capabilities:**
  - Error explanation
  - Code review
  - Educational feedback

---

## Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 100+ |
| TypeScript Files | 30+ |
| React Components | 25+ |
| UI Components | 20+ |
| API Routes | 2 |
| Pages | 6 |
| Lines of Code | ~5000+ |
| Dependencies | 50+ |
| Languages Supported | 3 (Python, Java, C) |

---

## Key Connections & Dependencies

```
┌─────────────────────────────────────────────────┐
│         Frontend (Next.js + React)               │
├─────────────────────────────────────────────────┤
│                                                  │
│  /compiler page → CodeEditor Component           │
│  useCompiler hook → Manages state                │
│  SaveCodeModal → savedCodeService                │
│                                                  │
└──────────────┬──────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│        Next.js API Routes (Backend)              │
├──────────────────────────────────────────────────┤
│                                                  │
│  /api/compiler/run                               │
│  ├─ Calls Judge0 API                             │
│  └─ Returns execution result                     │
│                                                  │
│  /api/compiler/debug                             │
│  ├─ Calls Gemini API                             │
│  └─ Returns AI analysis                          │
│                                                  │
└──────┬────────────────────┬──────────────────────┘
       │                    │
       ↓                    ↓
┌──────────────┐    ┌────────────────────┐
│ Judge0 API   │    │ Gemini API         │
│ (RapidAPI)   │    │ (Google)           │
│              │    │                    │
│ • Execution  │    │ • AI analysis      │
│ • Compilation│    │ • Error explain    │
└──────────────┘    └────────────────────┘
```

---

## Future Enhancement Ideas

1. **Database Integration:**
   - Add PostgreSQL, MongoDB, or Firebase
   - Sync saved code with cloud

2. **User Management:**
   - Real authentication (JWT, OAuth)
   - User profiles and settings
   - Code sharing features

3. **Code Collaboration:**
   - Real-time collaboration (WebSocket)
   - Code sharing links
   - Comments and annotations

4. **More Languages:**
   - JavaScript/Node.js
   - Go, Rust, C++
   - Ruby, PHP, etc.

5. **Advanced Features:**
   - Code formatting/linting
   - Git integration
   - Version control
   - Debugger interface
   - Package manager support

6. **Performance:**
   - Caching compilation results
   - Code completion (Copilot integration)
   - Syntax highlighting improvements

---

## Troubleshooting

### Common Issues

**Issue:** API returns 500 error
- **Solution:** Check API keys in `.env.local`

**Issue:** Code execution times out
- **Solution:** Judge0 limit is 5 seconds, reduce code complexity

**Issue:** Gemini returns fewer results
- **Solution:** Free tier has quotas, upgrade or wait

**Issue:** localStorage data lost
- **Solution:** Browser private mode doesn't persist data

**Issue:** Components not loading
- **Solution:** Ensure all Radix UI dependencies are installed

---

## Contact & Support

- **Project Name:** DevSphere
- **Version:** 0.1.0
- **Tagline:** Code faster. Debug smarter. Build better.

For questions or issues, refer to the code documentation and inline comments.

---

**Last Updated:** April 2026  
**Status:** Active Development
