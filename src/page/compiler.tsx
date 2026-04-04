"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LANG_CONFIG } from '@/constants/languages';
import { LanguageKey, PistonResponse } from '@/types/editor';

export default function DevSphereCompiler() {
  const [langKey, setLangKey] = useState<LanguageKey>('python');
  const [code, setCode] = useState<string>(LANG_CONFIG.python.starter);
  const [output, setOutput] = useState<string[]>(["Ready. Write code and click Run."]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'output' | 'errors' | 'ai'>('output');
  const [errorCount, setErrorCount] = useState(0);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const currentLang = LANG_CONFIG[langKey];

  // Sync starter code when language changes
  useEffect(() => {
    setCode(currentLang.starter);
    setOutput([`Ready. Switched to ${currentLang.name}.`]);
    setErrorCount(0);
  }, [langKey]);

  // Sync scroll between line numbers and textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const runCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setActiveTab('output');
    setOutput(["Compiling and running..."]);

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: currentLang.pistonLang,
          version: currentLang.pistonVersion,
          files: [{ name: currentLang.file, content: code }]
        })
      });

      const data: PistonResponse = await response.json();
      
      const stdout = data.run?.stdout || "";
      const stderr = data.run?.stderr || data.compile?.stderr || "";
      
      const finalOutput = [];
      if (stdout) finalOutput.push(...stdout.split('\n'));
      if (stderr) {
        finalOutput.push(...stderr.split('\n'));
        const detectedErrors = stderr.split('\n').filter(l => /error|exception/i.test(l)).length;
        setErrorCount(detectedErrors || 1);
      } else {
        setErrorCount(0);
      }

      setOutput(finalOutput.length > 0 ? finalOutput : ["Program exited with no output."]);
    } catch (error) {
      setOutput(["Error: Failed to connect to execution API."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#080e1c] text-[#e2e8f8] font-sans overflow-hidden">
      {/* Header */}
      <header className="h-[52px] bg-[#0f1729] border-b border-white/5 flex items-center px-4 gap-4">
        <div className="font-black text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-[#3ddc84] rounded-full shadow-[0_0_8px_#3ddc84]" />
          DevSphere
        </div>

        <div className="flex-1" />

        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-[#151e32] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentLang.color }} />
            <span>Language:</span>
            <span className="font-bold text-white">{currentLang.name}</span>
          </button>
          <div className="absolute top-full right-0 mt-2 w-40 bg-[#151e32] border border-white/10 rounded-xl hidden group-hover:block z-50 shadow-2xl">
            {(Object.keys(LANG_CONFIG) as LanguageKey[]).map((key) => (
              <div 
                key={key}
                onClick={() => setLangKey(key)}
                className="px-4 py-2 text-xs hover:bg-[#1c2840] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
              >
                {LANG_CONFIG[key].name}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={runCode}
          disabled={isLoading}
          className="bg-[#3ddc84] text-[#030a14] px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span>
          {isLoading ? 'Running...' : 'Run'}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-[#0f1729] border-r border-white/5 flex flex-col p-4">
          <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase mb-4">Explorer</div>
          <div className="flex items-center gap-2 text-xs text-[#3ddc84] bg-[#3ddc84]/10 p-2 rounded-lg border-l-2 border-[#3ddc84]">
            <span className="material-symbols-outlined text-sm">description</span>
            {currentLang.file}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#080e1c]">
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div 
              ref={lineNumbersRef}
              className="w-12 bg-[#080e1c] text-right pr-3 py-4 text-white/20 font-mono text-xs leading-loose select-none overflow-hidden"
            >
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editor */}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              spellCheck={false}
              className="flex-1 bg-transparent py-4 text-sm font-mono leading-loose outline-none resize-none caret-[#3ddc84]"
            />
          </div>

          {/* Terminal */}
          <div className="h-[220px] bg-[#0f1729] border-t border-white/5 flex flex-col">
            <div className="h-9 border-b border-white/5 flex px-4 items-center gap-6">
              {(['output', 'errors', 'ai'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold uppercase tracking-wider h-full border-b-2 transition-all ${
                    activeTab === tab ? 'text-[#3ddc84] border-[#3ddc84]' : 'text-white/30 border-transparent'
                  }`}
                >
                  {tab} {tab === 'errors' && errorCount > 0 && `(${errorCount})`}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 font-mono text-xs overflow-auto relative">
              {isLoading && (
                <div className="absolute inset-0 bg-[#0f1729]/80 backdrop-blur-sm flex items-center justify-center z-10">
                   <div className="flex items-center gap-3 bg-[#151e32] px-6 py-3 rounded-full border border-white/10">
                      <div className="w-4 h-4 border-2 border-[#3ddc84] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Executing Code...</span>
                   </div>
                </div>
              )}
              
              {activeTab === 'output' && (
                <div className="space-y-1">
                  {output.map((line, i) => (
                    <div key={i} className={line.includes('Error') ? 'text-[#f87171]' : 'text-[#3ddc84]'}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-6 bg-[#0f1729] border-t border-white/5 flex items-center px-4 justify-between text-[10px] text-white/30">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#3ddc84]">
            <div className="w-1.5 h-1.5 bg-[#3ddc84] rounded-full" />
            {currentLang.name}
          </span>
          <span>main</span>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span className="text-[#3ddc84]">Piston Engine ✓</span>
        </div>
      </footer>
    </div>
  );
}