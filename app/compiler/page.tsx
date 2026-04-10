'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompiler } from '@/hooks/use-compiler';
import { getLocalSessionUserId } from '@/lib/localSession';
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
    pushOutputLine,
  } = useCompiler();

  const downloadCodeAsFile = (filename: string, contents: string) => {
    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const toSafeFilename = (name: string) =>
    name
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-') // windows-illegal + control chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^\.+/, '')
      .slice(0, 80) || 'code';

  // Session + load saved code from Saved Projects (sessionStorage)
  useEffect(() => {
    const userId = getLocalSessionUserId();
    setUser(userId ? { id: userId } : null);

    const savedCodeJSON = sessionStorage.getItem('loadCode');
    if (savedCodeJSON) {
      try {
        const savedCode = JSON.parse(savedCodeJSON);
        if (savedCode.language) {
          setLangKey(savedCode.language as any);
        }
        setCode(savedCode.code);
        sessionStorage.removeItem('loadCode');
      } catch (err) {
        console.error('Error parsing saved code:', err);
      }
    }
  }, [setCode, setLangKey]);

  const handleSave = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveCode = async (title: string, description: string) => {
    if (!user) {
      router.push('/login');
      throw new Error('Please sign in to save code.');
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
        const ext = currentLang.file.includes('.') ? currentLang.file.split('.').pop() : '';
        const safeBase = toSafeFilename(title);
        const filename = ext && !safeBase.toLowerCase().endsWith(`.${ext.toLowerCase()}`)
          ? `${safeBase}.${ext}`
          : safeBase;

        pushOutputLine({ type: 'info', text: `Saved: ${title} (${langKey}) → ${filename}` });
        downloadCodeAsFile(filename, code);
      } else {
        setError(result.error);
        pushOutputLine({ type: 'error', text: `Save failed: ${result.error}` });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save code');
      pushOutputLine({ type: 'error', text: `Save failed: ${err?.message || 'Failed to save code'}` });
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
