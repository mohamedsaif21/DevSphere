'use client';

import React from 'react';
import { LanguageKey } from '../types/compiler';
import { LANG_CONFIG } from '../constants/languages';
import { IconRunPlay, IconAiSparkles } from './HeaderActionIcons';

interface HeaderProps {
  langKey: LanguageKey;
  isRunning: boolean;
  onLangChange: (key: LanguageKey) => void;
  onRun: () => void;
  onDebug: () => void;
}

export default function Header({ langKey, isRunning, onLangChange, onRun, onDebug }: HeaderProps) {
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

      {/* Language selector */}
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

      {/* Buttons */}
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
