'use client';

import { Zap, FileCode, Settings, ChevronRight } from 'lucide-react';

const codeLines = [
  { indent: 0, tokens: [{ text: 'import', color: '#d0bcff' }, { text: ' { Monolith } ', color: '#dce1fb' }, { text: 'from', color: '#d0bcff' }, { text: ' "@devsphere/core"', color: '#4ae176' }] },
  { indent: 0, tokens: [{ text: '', color: '' }] },
  { indent: 0, tokens: [{ text: 'async function', color: '#d0bcff' }, { text: ' initializeWorkspace', color: '#4ae176' }, { text: '() {', color: '#dce1fb' }] },
  { indent: 1, tokens: [{ text: 'const', color: '#d0bcff' }, { text: ' engine ', color: '#dce1fb' }, { text: '=', color: '#cbc3d7' }, { text: ' await', color: '#d0bcff' }, { text: ' Monolith.', color: '#dce1fb' }, { text: 'init', color: '#4ae176' }, { text: '({', color: '#dce1fb' }] },
  { indent: 2, tokens: [{ text: 'runtime:', color: '#cbc3d7' }, { text: ' "typescript"', color: '#4ae176' }, { text: ',', color: '#dce1fb' }] },
  { indent: 2, tokens: [{ text: 'version:', color: '#cbc3d7' }, { text: ' "5.0"', color: '#4ae176' }, { text: ',', color: '#dce1fb' }] },
  { indent: 2, tokens: [{ text: 'aiDebug:', color: '#cbc3d7' }, { text: ' true', color: '#d0bcff' }] },
  { indent: 1, tokens: [{ text: '});', color: '#dce1fb' }] },
  { indent: 0, tokens: [{ text: '}', color: '#dce1fb' }] },
];

export default function IDEMockup() {
  return (
    <div
      className="relative max-w-4xl mx-auto mt-4 rounded-2xl overflow-hidden shadow-ds-glow animate-float"
      style={{ border: '1px solid rgba(73,68,84,0.5)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#151b2d', borderBottom: '1px solid rgba(73,68,84,0.4)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono"
          style={{ backgroundColor: '#0c1324', color: '#cbc3d7' }}
        >
          <FileCode className="w-3 h-3" style={{ color: '#d0bcff' }} />
          main.ts — devsphere-prod-01
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" style={{ color: '#494454' }} />
        </div>
      </div>

      <div className="flex" style={{ backgroundColor: '#0c1324', minHeight: '260px' }}>
        <div
          className="w-44 flex-shrink-0 py-4 px-3 hidden sm:block"
          style={{ backgroundColor: '#151b2d', borderRight: '1px solid rgba(73,68,84,0.3)' }}
        >
          <div className="text-xs mb-3 font-grotesk font-medium" style={{ color: '#cbc3d7' }}>EXPLORER</div>
          <div className="space-y-0.5">
            {[
              { name: 'src', indent: 0, folder: true },
              { name: 'index.ts', indent: 1, active: true },
              { name: 'config.json', indent: 1 },
              { name: 'main.ts', indent: 1, active: false },
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 py-1 px-2 rounded-md text-xs cursor-pointer transition-colors"
                style={{
                  paddingLeft: `${(file.indent * 12) + 8}px`,
                  color: file.active ? '#dce1fb' : '#cbc3d7',
                  backgroundColor: file.active ? 'rgba(208,188,255,0.08)' : 'transparent',
                }}
              >
                {file.folder ? (
                  <ChevronRight className="w-3 h-3" style={{ color: '#d0bcff' }} />
                ) : (
                  <span className="w-3 h-3 flex items-center justify-center text-xs" style={{ color: '#4ae176' }}>
                    {file.name.endsWith('.ts') ? 'TS' : '{}'}
                  </span>
                )}
                <span className="font-mono truncate">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4">
            <div className="flex flex-col text-right select-none" style={{ color: '#494454' }}>
              {codeLines.map((_, i) => (
                <span key={i} className="code-text text-xs leading-7">{i + 1}</span>
              ))}
            </div>
            <div className="flex-1">
              {codeLines.map((line, i) => (
                <div key={i} className="code-text text-xs leading-7 whitespace-pre">
                  {' '.repeat(line.indent * 2)}
                  {line.tokens.map((token, j) => (
                    <span key={j} style={{ color: token.color }}>{token.text}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-6 right-6 glass-card rounded-xl p-3 max-w-xs animate-glow-pulse hidden sm:block"
        style={{ border: '1px solid rgba(74,225,118,0.25)' }}
      >
        <div className="flex items-start gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: '#0c1324' }} />
          </div>
          <div>
            <div className="text-xs font-semibold font-grotesk mb-1" style={{ color: '#4ae176' }}>
              AI Debugger
            </div>
            <div className="text-xs leading-relaxed" style={{ color: '#cbc3d7' }}>
              Type mismatch detected in{' '}
              <span style={{ color: '#d0bcff' }}>initializeWorkspace</span>
              . Auto-fixing in 0.4s...
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(73,68,84,0.4)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: '75%',
                background: 'linear-gradient(90deg, #4ae176, #00a74b)',
                boxShadow: '0 0 8px rgba(74,225,118,0.5)',
              }}
            />
          </div>
          <span className="text-xs font-mono" style={{ color: '#4ae176' }}>75%</span>
        </div>
      </div>
    </div>
  );
}
