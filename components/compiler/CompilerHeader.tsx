'use client';

import React from 'react';
import { Save } from 'lucide-react';

function IconRunPlay({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V19.89a1.5 1.5 0 0 0 2.3 1.269l11.344-7.89a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
    </svg>
  );
}

function IconAiSparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.698l.258 6.653a.75.75 0 0 1-.728.727l-6.653.258a.75.75 0 0 1-.728-.728l-.258-6.653a.75.75 0 0 1 .728-.727l6.653-.258Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

import { LanguageKey } from '@/types/compiler';
import { LANG_CONFIG } from '@/constants/languages';

interface HeaderProps {
  langKey: LanguageKey;
  isRunning: boolean;
  onLangChange: (key: LanguageKey) => void;
  onRun: () => void;
  onDebug: () => void;
  onSave: () => void;
}

export default function CompilerHeader({ langKey, isRunning, onLangChange, onRun, onDebug, onSave }: HeaderProps) {
  const currentLang = LANG_CONFIG[langKey];

  return (
    <header className="ds-header">
      <div className="ds-logo">
        <div className="ds-logo-dot" />
        DevSphere
      </div>

      <nav className="ds-nav">
        <span className="ds-nav-item ds-nav-active">Files</span>
        <span className="ds-nav-item">Edit</span>
        <span className="ds-nav-item">View</span>
        <span className="ds-nav-item">Terminal</span>
      </nav>

      <div className="ds-spacer" />

      <div className="ds-lang-wrap">
        <div className="ds-lang-btn">
          <div className="ds-lang-dot" style={{ background: currentLang.color }} />
          <span className="ds-lang-label">Language:</span>
          <span className="ds-lang-name">{currentLang.name}</span>
          <span className="material-symbols-outlined ds-chevron">expand_more</span>
        </div>
        <div className="ds-lang-dropdown">
          {(Object.keys(LANG_CONFIG) as LanguageKey[]).map((key) => (
            <div key={key} className="ds-lang-opt" onClick={() => onLangChange(key)}>
              <div className="ds-lang-opt-dot" style={{ background: LANG_CONFIG[key].color }} />
              {LANG_CONFIG[key].name}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="ds-btn-save"
        onClick={onSave}
        title="Save code"
      >
        <Save className="ds-btn-save-icon" size={16} />
      </button>

      <button
        type="button"
        className={`ds-btn-run ${isRunning ? 'ds-btn-run-loading' : ''}`}
        onClick={onRun}
        disabled={isRunning}
      >
        {isRunning ? (
          <span className="ds-spinner" />
        ) : (
          <IconRunPlay className="ds-btn-run-icon" />
        )}
        {isRunning ? 'Running' : 'Run'}
      </button>

      <button className="ds-btn-debug" type="button" onClick={onDebug}>
        <IconAiSparkles className="ds-btn-debug-icon" />
        AI Debug
      </button>

      <div className="ds-avatar">DS</div>
    </header>
  );
}
