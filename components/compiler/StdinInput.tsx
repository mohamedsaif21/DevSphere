'use client';

import { useState } from 'react';

interface StdinInputProps {
  value:    string;
  onChange: (val: string) => void;
}

export default function StdinInput({ value, onChange }: StdinInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      background: '#0f1729',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
    }}>
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 transition-colors"
        style={{ color: value.trim() ? '#4ae176' : 'rgba(220,225,251,0.4)' }}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
             style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          <span className="material-symbols-outlined text-sm">input</span>
          Program Input (stdin)
          {value.trim() && (
            <span className="px-2 py-0.5 rounded-full text-[10px]"
                  style={{ background: 'rgba(74,225,118,0.15)', color: '#4ae176', border: '1px solid rgba(74,225,118,0.2)' }}>
              Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!value.trim() && (
            <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Required for input() programs
            </span>
          )}
          <span className="material-symbols-outlined text-sm">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {/* Input area */}
      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-[11px]" style={{ color: 'rgba(220,225,251,0.4)', fontFamily: 'Space Grotesk, sans-serif' }}>
            If your code uses <code style={{ color: '#a78bfa' }}>input()</code>, type the values here — one per line.
            They will be fed into your program automatically when you click Run.
          </p>
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={'e.g.\n5\nJohn\n10 20'}
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
            style={{
              background: '#070d1f',
              color: '#dce1fb',
              border: '1px solid rgba(73,68,84,0.3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(74,225,118,0.5)'}
            onBlur={e  => e.currentTarget.style.borderColor = 'rgba(73,68,84,0.3)'}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px]" style={{ color: 'rgba(220,225,251,0.3)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Each line = one input() call
            </p>
            {value.trim() && (
              <button
                onClick={() => onChange('')}
                className="text-[10px] transition-colors"
                style={{ color: 'rgba(248,113,113,0.6)', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}