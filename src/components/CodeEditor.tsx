'use client';

import React, { useRef, useCallback } from 'react';

interface CodeEditorProps {
  code: string;
  filename: string;
  onChange: (val: string) => void;
}

export default function CodeEditor({ code, filename, onChange }: CodeEditorProps) {
  const lineNumsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = Math.max(code.split('\n').length, 15);

  const handleScroll = useCallback(() => {
    if (lineNumsRef.current && textareaRef.current) {
      lineNumsRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const newVal = ta.value.substring(0, s) + '    ' + ta.value.substring(ta.selectionEnd);
      onChange(newVal);
      // Restore cursor after React re-render
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
    }
  }, [onChange]);

  return (
    <div className="ds-editor-wrap">
      {/* Tab bar */}
      <div className="ds-editor-tabs">
        <div className="ds-tab ds-tab-active">
          <span className="material-symbols-outlined ds-tab-icon">description</span>
          <span>{filename}</span>
          <span className="material-symbols-outlined ds-tab-close">close</span>
        </div>
      </div>

      {/* Editor body */}
      <div className="ds-editor-body">
        <div className="ds-line-nums" ref={lineNumsRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="ds-textarea"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
}
