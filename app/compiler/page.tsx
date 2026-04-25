'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompiler } from '@/hooks/use-compiler';
import { saveCode } from '@/lib/savedCodeService';
import CompilerHeader from '@/components/compiler/CompilerHeader';
import CodeEditor from '@/components/compiler/CodeEditor';
import TerminalPanel from '@/components/compiler/TerminalPanel';
import StatusBar from '@/components/compiler/StatusBar';
import SaveCodeModal from '@/components/compiler/SaveCodeModal';

export default function CompilerPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    langKey, setLangKey,
    code, setCode,
    stdin, setStdin,
    outputLines,
    errorItems,
    aiLines, aiState,
    isRunning,
    activeTab, setActiveTab,
    errorCount,
    runCode, debugCode, clearOutput,
    currentLang,
  } = useCompiler();

  // Check auth and load saved code if available
  useEffect(() => {
    const initPage = async () => {
      try {
        // Check auth using localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userEmail = localStorage.getItem('userEmail');
        if (isLoggedIn !== 'true' || !userEmail) {
          router.replace('/login');
          return;
        }
        setUser({ email: userEmail });

        // Check if there's code to load from saved projects
        const savedCodeJSON = sessionStorage.getItem('loadCode');
        if (savedCodeJSON) {
          try {
            const savedCode = JSON.parse(savedCodeJSON);
            // Set language first, then code
            if (savedCode.language) {
              setLangKey(savedCode.language as any);
            }
            setCode(savedCode.code);
            sessionStorage.removeItem('loadCode');
          } catch (err) {
            console.error('Error parsing saved code:', err);
          }
        }
      } catch (err) {
        console.error('Error initializing compiler:', err);
      }
    };

    initPage();
  }, [router, setCode, setLangKey]);

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleSaveCode = async (title: string, description: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!code.trim()) {
      throw new Error('Cannot save empty code');
    }

    setIsSaving(true);
    try {
      const result = await saveCode(user.email, {
        title,
        language: langKey,
        code,
        description,
      });

      if (!result.success) {
        throw new Error(result.error);
      }
    } finally {
      setIsSaving(false);
    }
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
            stdin={stdin}
            onStdinChange={setStdin}
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

      <SaveCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCode}
        isLoading={isSaving}
      />
    </div>
  );
}
