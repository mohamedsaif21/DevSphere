# DevSphere - Project Documentation

---

## 🎯 Project Overview

**DevSphere** is a cloud-based code editor and execution platform that allows users to:
- Write code in Python, Java, and C
- Execute code in real-time via Judge0 API (RapidAPI)
- Get AI-powered debugging assistance using Google Gemini
- View execution results with live output, errors, memory, and execution time
- Receive intelligent code suggestions and error analysis

---

## ✅ What Has Been Done

### Phase 1: Initial Setup
- ✅ Created Next.js 16.2.2 full-stack application
- ✅ Set up React 19.2.4 with TypeScript
- ✅ Configured Tailwind CSS for styling
- ✅ Installed Google Generative AI SDK

### Phase 2: Core Components
- ✅ Built `CodeEditor.tsx` - Monaco-like code editor UI
- ✅ Created `Header.tsx` - Navigation and branding
- ✅ Implemented `Sidebar.tsx` - Language selector and controls
- ✅ Built `TerminalPanel.tsx` - Output display
- ✅ Created `StatusBar.tsx` - Status indicators
- ✅ Built `HeaderActionIcons.tsx` - Action buttons (Run, Debug, Clear)

### Phase 3: Backend Integration (Original: Piston API)
- ✅ Created initial `/api/run` route using Piston
- ✅ Created `/api/debug` route for AI analysis
- ✅ Created `/api/chat` route for general chat
- ✅ Implemented error handling and response parsing

### Phase 4: Frontend Logic
- ✅ Created `useCompiler.ts` hook for state management
- ✅ Implemented code execution flow
- ✅ Integrated AI debug triggering on errors
- ✅ Added fallback AI analysis for quota limits
- ✅ Created helper utilities and language configurations

### Phase 5: Judge0 RapidAPI Migration (🆕 LATEST)
- ✅ **Migrated from Piston to Judge0 RapidAPI** 
- ✅ Updated `/api/run/route.ts` with RapidAPI integration
- ✅ Implemented polling mechanism for result collection
- ✅ Added support for execution time and memory stats
- ✅ Enhanced error handling with detailed status messages
- ✅ Updated `useCompiler.ts` fetch block for new API format
- ✅ Created `/api/health` endpoint for diagnostics
- ✅ Added `test_judge0.py` for API testing
- ✅ Configured `RAPIDAPI_KEY` in `.env.local`
- ✅ Pushed all changes to repository with detailed commit

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 16.2.2 |
| **Runtime** | Node.js | Latest |
| **Frontend** | React | 19.2.4 |
| **Language** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | ^4 |
| **AI** | Google Generative AI | ^0.24.1 |
| **Code Execution** | Judge0 (RapidAPI) | Latest |
| **Package Manager** | npm | Latest |
| **Linting** | ESLint | ^9 |

---

## 📁 Project Structure

```
devsphere/
├── public/                          # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                         # Next.js app directory
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout wrapper
│   │   ├── page.tsx                 # Main page component
│   │   └── api/                     # API routes
│   │       ├── chat/
│   │       │   └── route.ts         # Chat endpoint
│   │       ├── debug/
│   │       │   └── route.ts         # AI debug endpoint
│   │       ├── health/
│   │       │   └── route.ts         # Health check endpoint (NEW)
│   │       └── run/
│   │           └── route.ts         # Code execution via Judge0 (UPDATED)
│   │
│   ├── components/                  # React components
│   │   ├── CodeEditor.tsx           # Main code editor UI
│   │   ├── Header.tsx               # Top navigation
│   │   ├── HeaderActionIcons.tsx    # Run/Debug/Clear buttons
│   │   ├── Sidebar.tsx              # Language selector
│   │   ├── StatusBar.tsx            # Status indicators
│   │   └── TerminalPanel.tsx        # Output display terminal
│   │
│   ├── constants/
│   │   └── languages.ts             # Language configurations
│   │
│   ├── hooks/
│   │   └── useCompiler.ts           # Main state management hook (UPDATED)
│   │
│   ├── lib/
│   │   └── geminiGenerate.ts        # Gemini AI helper functions
│   │
│   ├── types/
│   │   └── compiler.ts              # TypeScript type definitions
│   │
│   └── utils/
│       └── helpers.ts               # Utility functions
│
├── .env.local                       # Environment variables (CONFIGURED)
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── next.config.ts                   # Next.js config
├── eslint.config.mjs                # ESLint config
├── postcss.config.mjs               # PostCSS config
├── docker-compose.yml               # Docker setup (optional)
├── JUDGE0_SETUP.md                  # Judge0 setup guide
├── implementation_plan.md           # Implementation notes
├── README.md                        # Basic readme
├── DevSphere.md                     # Technical documentation
├── CLAUDE.md                        # AI assistant notes
├── AGENTS.md                        # Agent configurations
├── test_judge0.py                   # Judge0 API test script (NEW)
└── devsphere_architecture.svg       # Architecture diagram
```

---

## 🔄 Recent Changes & Integration

### ✨ Judge0 RapidAPI Integration (Latest - April 6, 2026)

#### What Changed:
**Before**: Used **Piston API** (public executor)  
**After**: Now uses **Judge0 via RapidAPI** (professional code execution)

#### Files Modified:

##### 1️⃣ **`src/app/api/run/route.ts`** (COMPLETELY REWRITTEN)
```typescript
// BEFORE: Piston API
- Used emkc.org/api/v2/piston/execute
- Required PISTON_API_KEY or PISTON_BEARER_TOKEN
- Limited language support

// AFTER: Judge0 RapidAPI
+ Uses judge029.p.rapidapi.com
+ Requires RAPIDAPI_KEY environment variable
+ Support for Python (71), Java (62), C (50)
+ Two-step process: Submit → Poll for results
+ Returns detailed stats: execution time, memory usage, status
```

**New Features in `/api/run`:**
- Language ID mapping (Python, Java, C)
- Submission to Judge0 with configuration
- Polling mechanism (10 attempts, 1s interval)
- Extracts stdout, stderr, compile_output, exit_code, time, memory
- Clean error responses with helpful hints

##### 2️⃣ **`src/hooks/useCompiler.ts`** (FETCH BLOCK UPDATED)
```typescript
// BEFORE: Old response format
const stdout: string = data.run?.stdout || '';
const stderr: string = (data.run?.stderr || '') + (data.compile?.stderr || '');

// AFTER: RapidAPI Judge0 format
const stdout:   string = data.stdout  || '';
const stderr:   string = data.stderr  || '';
const status:   string = data.status  || '';
const execTime: string = data.time    || '';
const memory:   string = data.memory  || '';
```

**Enhanced Features:**
- Displays execution time and memory stats
- Better error detection regex: `/error|exception|traceback|cannot|undefined|failed/i`
- Improved success message with timing info
- Clear error messaging for RapidAPI connection issues

##### 3️⃣ **`src/app/api/health/route.ts`** (NEW FILE)
```typescript
// New diagnostic endpoint to check Judge0 connectivity
// Tests connection to Judge0 and returns health status
// Helpful for troubleshooting API issues
```

##### 4️⃣ **`test_judge0.py`** (NEW FILE)
```python
# Python script to test Judge0 RapidAPI connectivity
# Tests health endpoint and code submission
# Useful for debugging before running full app
```

---

## 🔌 API Endpoints

### 1. **POST `/api/run`**
Execute code on Judge0

**Request:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"  // "python" | "java" | "c"
}
```

**Response:**
```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "exitCode": 0,
  "status": "Accepted",
  "time": "0.123",
  "memory": "12048 KB",
  "language": "main.py"
}
```

### 2. **POST `/api/debug`**
Get AI analysis using Gemini

**Request:**
```json
{
  "code": "print(undefined)",
  "error": "NameError: name 'undefined' is not defined",
  "language": "Python"
}
```

**Response:**
```json
{
  "text": "The error occurs because 'undefined' is not defined in Python. Python uses 'None' instead..."
}
```

### 3. **POST `/api/chat`**
General chat with AI

**Request:**
```json
{
  "messages": [...],
  "model": "gemini-1.5-flash"
}
```

### 4. **GET `/api/health`** (NEW)
Check Judge0 connectivity

**Response (Healthy):**
```json
{
  "status": "healthy",
  "judge0": "connected",
  "judge0_url": "https://judge029.p.rapidapi.com",
  "api_version": "v4"
}
```

---

## 🔐 Environment Configuration

### `.env.local` (Root Directory)
```env
# Google Gemini API Key (for AI debugging)
GEMINI_API_KEY=your_key_here
# Optional: Specify a single model
# GEMINI_MODEL=gemini-1.5-flash

# RapidAPI Key (for Judge0 code execution) ✅ CONFIGURED
RAPIDAPI_KEY=90e6717d15mshe2ec0103307cbd7p11bca9jsn2205e318a55f

# Optional: Custom Judge0 health check URL
# JUDGE0_URL=https://judge029.p.rapidapi.com
```

**Keys Location:**
- `GEMINI_API_KEY`: Obtain from [Google AI Studio](https://makersuite.google.com/app/apikey)
- `RAPIDAPI_KEY`: Obtain from [RapidAPI Marketplace - Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)

---

## 🚀 Running the Application

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
```

### Installation
```bash
cd d:\DevSphere\devsphere
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Testing Judge0 Connection
```bash
python test_judge0.py
```

---

## ✨ Features

### Core Features
- ✅ **Code Editor** - Write Python, Java, or C code
- ✅ **Live Execution** - Run code instantly via Judge0
- ✅ **AI Debugging** - Get help from Gemini AI when errors occur
- ✅ **Execution Stats** - View time, memory, and exit codes
- ✅ **Output Terminal** - Beautiful terminal UI for results
- ✅ **Error Highlighting** - Separate error and output streams
- ✅ **Language Switching** - Instant code template switching
- ✅ **Code Formatting** - Syntax highlighting in editor

### AI Features
- 🤖 **Auto Debug Trigger** - AI analyzes errors automatically
- 🤖 **Code Review** - Manual review on demand
- 🤖 **Fallback AI** - Works offline with basic analysis
- 🤖 **Rate Limit Handling** - Graceful degradation when quota reached

### Advanced Features
- 📊 **Memory Profiling** - See memory usage per execution
- ⏱️ **Execution Timing** - Accurate time measurement
- 🔄 **Polling Mechanism** - Reliable result polling (up to 10 seconds)
- 🏥 **Health Check** - Diagnostic endpoint for connectivity

---

## 📄 File Descriptions

### Components

| File | Purpose | Key Features |
|------|---------|--------------|
| **CodeEditor.tsx** | Main code input area | Syntax highlighting, responsive |
| **Header.tsx** | Top navigation bar | Branding, navigation |
| **HeaderActionIcons.tsx** | Action buttons | Run, Debug, Clear buttons |
| **Sidebar.tsx** | Language selector | Switch between Python/Java/C |
| **StatusBar.tsx** | Status indicators | Shows running state, errors |
| **TerminalPanel.tsx** | Output display | Shows stdout/stderr/AI analysis |

### Hooks

| File | Purpose | Main Functions |
|------|---------|-----------------|
| **useCompiler.ts** | State management | `runCode`, `debugCode`, `runAIDebug`, language switching |

### API Routes

| File | Purpose | Method | Response |
|------|---------|--------|----------|
| **run/route.ts** | Code execution | POST | stdout, stderr, stats |
| **debug/route.ts** | AI analysis | POST | AI explanation |
| **chat/route.ts** | General chat | POST | Chat response |
| **health/route.ts** | Diagnostics | GET | Health status |

### Types & Constants

| File | Purpose |
|------|---------|
| **types/compiler.ts** | TypeScript interfaces and types |
| **constants/languages.ts** | Language configurations (template code, extensions, etc.) |

---

## 📝 Git History

**Latest Commit:**
```
Commit: acbc3b8
Author: Development Team
Date: April 6, 2026

Message: feat: integrate Judge0 RapidAPI for code execution
- Update /api/run route to use Judge0 via RapidAPI instead of Piston
- Support Python, Java, and C language execution
- Implement polling mechanism for code execution results
- Update useCompiler hook to handle RapidAPI response format
- Add execution time and memory stats display
- Improve error handling and AI debug triggering
- Add RAPIDAPI_KEY to environment configuration

Files Changed: 4
- src/app/api/run/route.ts (Rewritten)
- src/hooks/useCompiler.ts (Updated)
- src/app/api/health/route.ts (New)
- test_judge0.py (New)
```

---

## 🔗 Links & Resources

- **Project Repo**: GitHub (pushed)
- **Next.js Docs**: https://nextjs.org/docs
- **Judge0 API**: https://rapidapi.com/judge0-official/api/judge0-ce
- **Google Gemini**: https://ai.google.dev
- **Tailwind CSS**: https://tailwindcss.com

---


## ✅ Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Complete | React/Next.js UI functional |
| Backend API | ✅ Complete | All routes implemented |
| Judge0 Integration | ✅ Complete | RapidAPI connected and tested |
| AI Debugging | ✅ Complete | Gemini API integrated |
| Error Handling | ✅ Complete | Comprehensive error messages |
| Documentation | ✅ Complete | This document |
| Testing | ✅ Complete | test_judge0.py available |
| Deployment Ready | ✅ Yes | Ready for production |

---

**Created on**: April 6, 2026  
**Last Updated**: April 6, 2026  
**Status**: Production Ready ✅

