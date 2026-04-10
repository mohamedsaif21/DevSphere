'use client';

import React from 'react';
import { TerminalTab, OutputLine, ErrorItem } from '@/types/compiler';
import { AILine, AIState } from '@/hooks/use-compiler';

interface TerminalPanelProps {
  activeTab: TerminalTab;
  onTabChange: (tab: TerminalTab) => void;
  outputLines: OutputLine[];
  errorItems: ErrorItem[];
  errorCount: number;
  aiLines: AILine[];
  aiState: AIState;
  isRunning: boolean;
  onClear: () => void;
}

export default function TerminalPanel({
  activeTab,
  onTabChange,
  outputLines,
  errorItems,
  errorCount,
  aiLines,
  aiState,
  isRunning,
  onClear,
}: TerminalPanelProps) {
  return (
    <div className="ds-terminal">
      <div className="ds-term-tabs">
        <button
          className={`ds-term-tab ${activeTab === 'output' ? 'ds-term-tab-active' : ''}`}
          onClick={() => onTabChange('output')}
        >
          <span className="material-symbols-outlined ds-term-tab-icon">terminal</span>
          Output
        </button>

        <button
          className={`ds-term-tab ds-err-tab ${activeTab === 'errors' ? 'ds-term-tab-active ds-err-active' : ''}`}
          onClick={() => onTabChange('errors')}
        >
          <span className="material-symbols-outlined ds-term-tab-icon">error_outline</span>
          Errors
          {errorCount > 0 && <span className="ds-badge">{errorCount}</span>}
        </button>

        <button
          className={`ds-term-tab ds-ai-tab ${activeTab === 'ai' ? 'ds-term-tab-active ds-ai-active' : ''}`}
          onClick={() => onTabChange('ai')}
        >
          <span className="material-symbols-outlined ds-term-tab-icon">auto_awesome</span>
          AI Debug
        </button>

        <div className="ds-spacer" />

        <div className="ds-term-actions">
          <button className="ds-term-action-btn material-symbols-outlined" onClick={onClear} title="Clear">
            block
          </button>
          <button className="ds-term-action-btn material-symbols-outlined" title="Minimize">
            expand_more
          </button>
        </div>
      </div>

      <div className="ds-term-content">
        {isRunning && (
          <div className="ds-loading-overlay">
            <div className="ds-spinner-wrap">
              <div className="ds-spinner" />
              <span className="ds-spinner-text">
                {activeTab === 'ai' ? 'AI is thinking...' : 'Running code...'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="ds-panel">
            <div className="ds-term-header">DevSphere Terminal v1.0.0 · Piston API</div>
            {outputLines.map((line, i) => (
              <div key={i} className={`ds-line ds-line-${line.type}`}>
                {line.text}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="ds-panel">
            {errorItems.length === 0 ? (
              <div className="ds-empty">
                <span className="material-symbols-outlined ds-empty-icon" style={{ color: 'var(--ds-green)' }}>
                  check_circle
                </span>
                <div className="ds-empty-title" style={{ color: 'var(--ds-green)' }}>No errors detected</div>
                <div className="ds-empty-sub">Your code is clean!</div>
              </div>
            ) : (
              errorItems.map((item, i) => (
                <div key={i} className="ds-err-item">
                  <span className="material-symbols-outlined ds-err-icon">
                    {item.isError ? 'error' : 'warning'}
                  </span>
                  <div>
                    <div className="ds-err-msg">{item.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ds-panel">
            {aiState === 'idle' && (
              <div className="ds-empty">
                <span className="material-symbols-outlined ds-empty-icon">auto_awesome</span>
                <div className="ds-empty-title">AI assistant ready</div>
                <div className="ds-empty-sub">Run code with an error, or click AI Debug</div>
              </div>
            )}

            {aiState === 'thinking' && (
              <div className="ds-ai-bubble">
                <div className="ds-ai-header">
                  <div className="ds-ai-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                    DevSphere AI
                  </div>
                </div>
                <div className="ds-ai-thinking">
                  <div className="ds-ai-dot" />
                  <div className="ds-ai-dot" />
                  <div className="ds-ai-dot" />
                </div>
              </div>
            )}

            {aiState === 'done' && aiLines.length > 0 && (
              <div className="ds-ai-bubble ds-fade-in">
                <div className="ds-ai-header">
                  <div className="ds-ai-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                    DevSphere AI
                  </div>
                </div>
                {aiLines.map((line, i) => {
                  if (line.type === 'title') {
                    return <div key={i} className="ds-ai-title">{line.content}</div>;
                  }
                  if (line.type === 'code') {
                    return <pre key={i} className="ds-ai-code">{line.content}</pre>;
                  }
                  if (line.type === 'spacer') {
                    return <div key={i} style={{ height: 6 }} />;
                  }
                  return <div key={i} className="ds-ai-text">{line.content}</div>;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
