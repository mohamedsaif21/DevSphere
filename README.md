<h1 align="center"><strong>DevSphere — AI-Powered Online Code IDE</strong></h1>

<p align="center">
  <strong>Write, run, debug, and save code with AI-powered assistance.</strong>
</p>

<p align="center">
  <strong>Next.js • React • TypeScript • Tailwind CSS • Gemini AI • Judge0</strong>
</p>

<p align="center">
  <strong>
    <a href="https://dev-sphere-psi.vercel.app/">🌐 Live Application</a>
    &nbsp
  </strong>
</p>

🖥️ Dashboard Preview

<p align="center">
  <img src="dashboard.png" alt="DevSphere Dashboard" width="90%">
</p>

📌 Overview

DevSphere is a modern online code compiler and IDE that allows users to write, execute, debug, and save code from the browser.

The platform supports Python, Java, and C, with real-time code execution through Judge0 and AI-powered error analysis using Google Gemini.

✨ Features

💻 Multi-Language Support — Python, Java, and C

📝 Real-Time Code Editor — Syntax highlighting and line numbers

▶️ Code Execution — Run code with real-time output

🤖 AI-Powered Debugging — Explain errors and provide coding suggestions

💾 Save Projects — Save and manage code snippets locally

📊 User Dashboard — Centralized access to compiler and projects

📱 Responsive Design — Optimized for different screen sizes

🛠️ Tech Stack

Technology

Purpose

Next.js

Full-stack web framework

React

User interface

TypeScript

Type-safe development

Tailwind CSS

Styling

Radix UI

UI components

Google Gemini

AI debugging

Judge0 API

Code execution

Node.js

Backend runtime

Vercel / Netlify

Deployment

🚀 Quick Start

Prerequisites

Node.js 18+

npm

Git

Installation

git clone YOUR_GITHUB_REPOSITORY_URL
cd Devsphere
npm install

Create a .env.local file:

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
RAPIDAPI_KEY=your_rapidapi_key
NODE_ENV=development

Run Locally

npm run dev

Open:

http://localhost:3000

Build for Production

npm build
npm start

🔄 How It Works

User
  ↓
DevSphere IDE
  ↓
Select Language
  ↓
Write Code
  ↓
Run Code ──────────→ Judge0 API
  ↓                       ↓
Terminal Output ←─────────┘

If an error occurs
  ↓
Ask AI
  ↓
Google Gemini
  ↓
Error Explanation & Suggestions

🔌 API Routes

Method

Endpoint

Purpose

POST

/api/compiler/run

Compile and execute code

POST

/api/compiler/debug

Analyze code errors using AI

💾 Data Storage

DevSphere currently uses browser localStorage for:

Login session information

Saved code projects

No external database is currently required.

📁 Project Structure

Devsphere/
├── app/
│   ├── api/
│   │   └── compiler/
│   │       ├── run/
│   │       └── debug/
│   ├── compiler/
│   ├── home/
│   ├── login/
│   ├── register/
│   └── saved-projects/
│
├── components/
│   ├── compiler/
│   ├── home/
│   └── ui/
│
├── hooks/
├── lib/
├── types/
├── utils/
├── constants/
├── docs/
├── .env.example
└── package.json

🔮 Future Enhancements

Database-backed project storage

OAuth / JWT authentication

Code sharing and collaboration

Additional programming languages

Advanced debugging tools

Git integration

👨‍💻 Author

<p align="center">
  <strong>Mohamed Saif</strong><br>
  Frontend Developer | AI & Web Development
</p>

<p align="center">
  <a href="https://github.com/mohamedsaif21">GitHub</a>
  &nbsp;•&nbsp;
  <a href="https://www.linkedin.com/in/mohamed-saif24/">LinkedIn</a>
  &nbsp;•&nbsp;
  <a href="mailto:mohamedsaifb24@gmail.com">Email</a>
</p>
