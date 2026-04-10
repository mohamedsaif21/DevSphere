'use client';

import React from 'react';
import { useCompiler } from '@/hooks/use-compiler';
import CompilerHeader from '@/components/compiler/CompilerHeader';
import CodeEditor from '@/components/compiler/CodeEditor';
import TerminalPanel from '@/components/compiler/TerminalPanel';
import StatusBar from '@/components/compiler/StatusBar';

export default function CompilerPage() {
  const {
    langKey, setLangKey,
    code, setCode,
    outputLines,
    errorItems,
    aiLines, aiState,
    isRunning,
    activeTab, setActiveTab,
    errorCount,
    runCode, debugCode, clearOutput,
    currentLang,
  } = useCompiler();

  const handleSave = () => {
    // Save code to localStorage
    localStorage.setItem(`code_${langKey}`, code);
    // You can add a toast notification here later
    console.log('Code saved successfully');
  };

  return (
    <div className="ds-root">
      <CompilerHeader
        langKey={langKey}
        isRunning={isRunning}
        onLangChange={setLangKey}
        onRun={runCode}
        onDebug={debugCode}
        onSave={handleSave}
      />

      <div className="ds-workspace">
        <main className="ds-main">
          <CodeEditor
            code={code}
            filename={currentLang.file}
            onChange={setCode}
          />

          <TerminalPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            outputLines={outputLines}
            errorItems={errorItems}
            errorCount={errorCount}
            aiLines={aiLines}
            aiState={aiState}
            isRunning={isRunning}
            onClear={clearOutput}
          />
        </main>
      </div>

      <StatusBar langKey={langKey} errorCount={errorCount} />
    </div>
  );
}
