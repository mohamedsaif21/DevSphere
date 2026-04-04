"use client";

import React, { useState } from 'react';
import Image from 'next/image';

type Language = 'JavaScript' | 'Python' | 'Java' | 'C';

const SNIPPETS: Record<Language, string> = {
  JavaScript: `<div><span class="text-[#d0bcff]">import</span> { <span class="text-[#a078ff]">initialize</span> } <span class="text-[#d0bcff]">from</span> <span class="text-[#4ae176]">'devsphere-core'</span>;</div><div class="mt-1"><span class="text-[#494454]">// Initialize engine</span></div><div><span class="text-[#d0bcff]">const</span> engine = <span class="text-[#d0bcff]">new</span> <span class="text-[#a078ff]">initialize</span>({ mode: <span class="text-[#4ae176]">'prod'</span> });</div><div class="mt-2"><span class="text-[#dce1fb]">startApp();</span></div>`,
  Python: `<div><span class="text-[#d0bcff]">from</span> devsphere_core <span class="text-[#d0bcff]">import</span> <span class="text-[#a078ff]">initialize</span></div><div class="mt-1"><span class="text-[#494454]"># Initialize engine</span></div><div>engine = <span class="text-[#a078ff]">initialize</span>(mode=<span class="text-[#4ae176]">'prod'</span>)</div><div class="mt-2"><span class="text-[#a078ff]">print</span>(<span class="text-[#4ae176]">"> Hello DevSphere"</span>)</div>`,
  Java: `<div><span class="text-[#d0bcff]">public class</span> <span class="text-[#dce1fb]">Main</span> {</div><div class="pl-4"><span class="text-[#d0bcff]">public static void</span> <span class="text-[#a078ff]">main</span>(String[] args) {</div><div class="pl-8">System.out.<span class="text-[#a078ff]">println</span>(<span class="text-[#4ae176]">"> Hello"</span>);</div><div class="pl-4">}</div><div>}</div>`,
  C: `<div><span class="text-[#d0bcff]">#include</span> <span class="text-[#4ae176]">&lt;stdio.h&gt;</span></div><div class="mt-1"><span class="text-[#d0bcff]">int</span> <span class="text-[#a078ff]">main</span>() {</div><div class="pl-4"><span class="text-[#a078ff]">printf</span>(<span class="text-[#4ae176]">"> Hello\\n"</span>);</div><div class="pl-4"><span class="text-[#d0bcff]">return</span> 0;</div><div>}</div>`
};

export default function DevSphere() {
  const [language, setLanguage] = useState<Language>('JavaScript');
  const [isRunning, setIsRunning] = useState<boolean>(true);

  return (
    <div className="h-screen flex flex-col bg-[#0c1324] text-[#dce1fb] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-6 border-b border-[#494454]/15 h-[60px]">
        <div className="flex items-center gap-8">
          <div className="text-xl font-black tracking-tighter">DevSphere</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className="text-[#4ae176] font-bold border-b-2 border-[#4ae176] pb-1">Files</a>
            <a className="text-[#dce1fb]/60 hover:text-[#dce1fb] cursor-pointer">Edit</a>
            <a className="text-[#dce1fb]/60 hover:text-[#dce1fb] cursor-pointer">Terminal</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center bg-[#151b2d] px-3 py-1.5 rounded-xl border border-[#494454]/10 text-xs">
              <span className="mr-2 opacity-60">Language:</span>
              <span className="font-bold text-[#4ae176]">{language}</span>
              <span className="material-symbols-outlined text-[16px] ml-1">expand_more</span>
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block min-w-[140px] bg-[#23293c] border border-[#494454]/20 rounded-xl shadow-2xl z-50 overflow-hidden">
              {(['Python', 'JavaScript', 'Java', 'C'] as Language[]).map((lang) => (
                <div 
                  key={lang} 
                  onClick={() => setLanguage(lang)}
                  className="px-4 py-2 text-xs hover:bg-[#2e3447] cursor-pointer transition-colors"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="bg-gradient-to-br from-[#4ae176] to-[#00a74b] text-[#003915] font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isRunning ? 'stop' : 'play_arrow'}
            </span>
            {isRunning ? 'Stop' : 'Run'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[#151b2d] py-4 flex flex-col font-mono text-xs">
          <div className="px-4 mb-4 text-[#cbc3d7]/40 uppercase tracking-widest text-[10px] flex justify-between items-center">
            Explorer <span className="material-symbols-outlined text-[14px]">more_horiz</span>
          </div>
          
          <div className="px-2 space-y-0.5">
             <div className="flex items-center gap-1.5 px-2 py-1 text-[#dce1fb]/70 hover:bg-[#23293c]/50 rounded-md cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">folder</span>
                <span>src</span>
             </div>
             <div className="ml-4 flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#4ae176] bg-[#23293c] border-l-2 border-[#4ae176]">
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>main.js</span>
             </div>
          </div>

          <div className="mt-auto px-4">
             <div className="bg-[#23293c] p-3 rounded-xl border border-[#494454]/10 text-center">
                <p className="text-[10px] text-[#cbc3d7]/60 mb-2">main_branch</p>
                <button className="w-full bg-[#a078ff]/20 text-[#a078ff] py-1.5 rounded-lg font-bold text-[11px]">Collaborate</button>
             </div>
          </div>
        </aside>

        {/* Editor & Terminal */}
        <main className="flex-1 flex flex-col relative">
          <div className="h-10 bg-[#151b2d]/50 flex items-center px-2 gap-1 border-b border-[#494454]/5">
            <div className="flex items-center gap-2 px-4 h-full bg-[#0c1324] text-[#4ae176] border-t-2 border-[#4ae176] text-xs">
              <span className="material-symbols-outlined text-[14px]">description</span>
              main.js
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-auto p-4 flex font-mono text-[13px] leading-relaxed bg-[#0c1324]">
            <div className="w-10 text-[#494454] text-right pr-4 select-none opacity-50 border-r border-[#494454]/10 mr-4">
              {Array.from({ length: 15 }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div 
              className="flex-1 outline-none" 
              contentEditable 
              suppressContentEditableWarning
              spellCheck={false}
              dangerouslySetInnerHTML={{ __html: SNIPPETS[language] }}
              style={{ caretColor: '#4ae176' }}
            />
          </div>

          {/* Terminal */}
          <div className="h-[220px] bg-[#070d1f] border-t border-[#494454]/15 flex flex-col relative">
            <div className="flex items-center px-4 h-9 bg-[#151b2d]/30 border-b border-[#494454]/5 text-[11px] font-bold uppercase gap-6">
              <span className="text-[#4ae176] border-b-2 border-[#4ae176] h-full flex items-center">Output</span>
              <span className="text-[#cbc3d7]/40 h-full flex items-center">Errors</span>
            </div>
            
            <div className="flex-1 p-4 font-mono text-[12px] overflow-auto">
              <div className="text-[#494454]/50 mb-1">DevSphere Terminal v4.2.0-stable</div>
              <div className="text-[#4ae176]">{'>'} Hello DevSphere</div>
              <div className="text-[#cbc3d7]/60">Node environment: production</div>

              {isRunning && (
                <div className="absolute inset-0 bg-[#070d1f]/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-3 bg-[#23293c] px-6 py-3 rounded-full border border-[#494454]/20 shadow-2xl">
                    <div className="w-5 h-5 border-2 border-[#4ae176] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium text-sm">Running code...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-6 bg-[#23293c] border-t border-[#494454]/5 flex items-center px-4 justify-between text-[10px] text-[#cbc3d7]/60">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">sync_alt</span> main</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">refresh</span> 0 errors</span>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span className="text-[#4ae176] font-bold uppercase">{language}</span>
          <span className="flex items-center gap-1 text-[#4ae176]"><span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Prettier</span>
        </div>
      </footer>
    </div>
  );
}