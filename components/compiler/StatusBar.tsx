'use client';

import React from 'react';
import { LanguageKey } from '@/types/compiler';
import { LANG_CONFIG } from '@/constants/languages';

interface StatusBarProps {
  langKey: LanguageKey;
  errorCount: number;
}

export default function StatusBar({ langKey, errorCount }: StatusBarProps) {
  const lang = LANG_CONFIG[langKey];

  return (
    <footer className="ds-statusbar">
      <div className="ds-status-left">
        <div className="ds-status-item">
          <div className="ds-status-dot" />
          <span style={{ color: 'var(--ds-green)' }}>{lang.name}</span>
        </div>
        <div className="ds-status-item">
          <span className="material-symbols-outlined ds-status-icon">sync_alt</span>
          main
        </div>
        <div className="ds-status-item" style={{ color: errorCount > 0 ? 'var(--ds-red)' : undefined }}>
          <span className="material-symbols-outlined ds-status-icon">error_outline</span>
          {errorCount} {errorCount === 1 ? 'error' : 'errors'}
        </div>
      </div>
      <div className="ds-status-right">
        <div className="ds-status-item">UTF-8</div>
        <div className="ds-status-item">Spaces: 4</div>
        <div className="ds-status-item" style={{ color: 'var(--ds-green)' }}>
          <span className="material-symbols-outlined ds-status-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          Piston API
        </div>
      </div>
    </footer>
  );
}
