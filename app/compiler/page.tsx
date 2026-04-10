'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompiler } from '@/hooks/use-compiler';
import { supabase } from '@/lib/supabase';
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
  const [error, setError] = useState('');

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

  // Check auth and load saved code if available
  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }
        setUser(user);

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
      setError('User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveCode(user.id, {
        title,
        language: langKey,
        code,
        description,
      });

      if (result.success) {
        setError('');
        // Optional: Show success notification
        console.log('Code saved successfully');
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save code');
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
