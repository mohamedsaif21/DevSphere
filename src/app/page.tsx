'use client';

import React from 'react';
import { useCompiler } from '@/hooks/useCompiler';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CodeEditor from '@/components/CodeEditor';
import TerminalPanel from '@/components/TerminalPanel';
import StatusBar from '@/components/StatusBar';

export default function DevSpherePage() {
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

  return (
    <div className="ds-root">
      <Header
        langKey={langKey}
        isRunning={isRunning}
        onLangChange={setLangKey}
        onRun={runCode}
        onDebug={debugCode}
      />

      <div className="ds-workspace">
        <Sidebar filename={currentLang.file} />

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
