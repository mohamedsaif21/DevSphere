'use client';

import { Brain, Globe, Users, Cpu, Shield, Zap } from 'lucide-react';

function Badge({ text, color }: { text: string; color: 'primary' | 'tertiary' }) {
  const styles =
    color === 'tertiary'
      ? { bg: 'rgba(74,225,118,0.1)', border: 'rgba(74,225,118,0.2)', text: '#4ae176' }
      : { bg: 'rgba(208,188,255,0.1)', border: 'rgba(208,188,255,0.2)', text: '#d0bcff' };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium"
      style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, color: styles.text }}
    >
      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: styles.text }} />
      {text}
    </span>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 opacity-30"
        style={{ background: 'linear-gradient(to bottom, transparent, #d0bcff, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5 font-grotesk"
            style={{ backgroundColor: 'rgba(208,188,255,0.08)', border: '1px solid rgba(208,188,255,0.15)', color: '#d0bcff' }}
          >
            <Cpu className="w-3 h-3" />
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#dce1fb' }}>
            Everything you need to{' '}
            <span className="text-gradient-primary">ship faster</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#cbc3d7' }}>
            A complete development environment in your browser. No setup. No friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="md:col-span-2 rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
            style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.4)' }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(208,188,255,0.08) 0%, transparent 70%)' }}
            />
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(208,188,255,0.2) 0%, rgba(160,120,255,0.1) 100%)', border: '1px solid rgba(208,188,255,0.2)' }}
            >
              <Brain className="w-5 h-5" style={{ color: '#d0bcff' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: '#dce1fb' }}>
              AI-Driven Debugging
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#cbc3d7' }}>
              The Kinetic Monolith engine doesn&apos;t just find bugs; it predicts them. Powered by neural execution trees, DevSphere fixes syntax and logic errors before you hit &apos;Run&apos;.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge text="PREDICTING: NullPointerException" color="primary" />
              <Badge text="STABILIZING: Heap Allocation" color="tertiary" />
            </div>

            <div
              className="mt-6 rounded-xl p-4"
              style={{ backgroundColor: 'rgba(12,19,36,0.6)', border: '1px solid rgba(73,68,84,0.3)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#d0bcff' }} />
                <span className="text-xs font-grotesk font-medium" style={{ color: '#cbc3d7' }}>Neural Execution Engine</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Bugs Detected', value: '2,847', color: '#d0bcff' },
                  { label: 'Auto-Fixed', value: '2,801', color: '#4ae176' },
                  { label: 'Accuracy', value: '98.4%', color: '#4ae176' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-bold font-grotesk" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#cbc3d7' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]"
            style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.4)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(74,225,118,0.2) 0%, rgba(0,167,75,0.1) 100%)', border: '1px solid rgba(74,225,118,0.2)' }}
            >
              <Globe className="w-5 h-5" style={{ color: '#4ae176' }} />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: '#dce1fb' }}>
              Zero-Config Environments
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#cbc3d7' }}>
              Instant runtimes for Python, JavaScript, Java, and C. No local installs. No Docker hell. Just code.
            </p>

            <div className="space-y-2.5">
              {[
                { lang: 'Python 3.12', status: 'Ready', color: '#4ae176' },
                { lang: 'Node.js 20', status: 'Ready', color: '#4ae176' },
                { lang: 'Java 21', status: 'Spinning up', color: '#d0bcff' },
              ].map((env) => (
                <div
                  key={env.lang}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(12,19,36,0.6)', border: '1px solid rgba(73,68,84,0.3)' }}
                >
                  <span className="text-xs font-mono" style={{ color: '#dce1fb' }}>{env.lang}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: env.color }}
                    />
                    <span className="text-xs font-grotesk" style={{ color: env.color }}>{env.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="md:col-span-3 rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:scale-[1.005]"
            style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.4)' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(74,225,118,0.04) 0%, transparent 60%)' }}
            />
            <div className="relative flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, rgba(74,225,118,0.2) 0%, rgba(208,188,255,0.1) 100%)', border: '1px solid rgba(74,225,118,0.2)' }}
                >
                  <Users className="w-5 h-5" style={{ color: '#4ae176' }} />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: '#dce1fb' }}>
                  Real-time Collaboration
                </h3>
                <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#cbc3d7' }}>
                  Pair programming at light speed. Multi-user cursors, instant state syncing, and built-in voice/video layers that feel like you&apos;re sitting in the same room.
                </p>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-grotesk"
                  style={{ backgroundColor: 'rgba(208,188,255,0.08)', border: '1px solid rgba(208,188,255,0.15)', color: '#d0bcff' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#d0bcff' }} />
                  Alex typing...
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-3">
                {[
                  { initials: 'AK', bg: '#d0bcff', text: '#0c1324' },
                  { initials: 'MJ', bg: '#4ae176', text: '#0c1324' },
                  { initials: 'SR', bg: '#a078ff', text: '#0c1324' },
                  { initials: 'TL', bg: '#23293c', text: '#dce1fb', border: 'rgba(73,68,84,0.6)' },
                  { initials: '+4', bg: '#151b2d', text: '#cbc3d7', border: 'rgba(73,68,84,0.6)' },
                ].map((av, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-grotesk flex-shrink-0 transition-transform hover:scale-110 -ml-2 first:ml-0"
                    style={{
                      backgroundColor: av.bg,
                      color: av.text,
                      border: av.border ? `2px solid ${av.border}` : '2px solid #151b2d',
                      zIndex: 5 - i,
                    }}
                  >
                    {av.initials}
                  </div>
                ))}

                <div
                  className="ml-4 px-3 py-2 rounded-xl text-xs font-mono"
                  style={{ backgroundColor: 'rgba(12,19,36,0.7)', border: '1px solid rgba(73,68,84,0.3)', color: '#cbc3d7' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ae176' }} />
                    <span style={{ color: '#4ae176' }}>5 collaborators</span>
                  </div>
                  <div style={{ color: '#cbc3d7' }}>Sync latency: <span style={{ color: '#d0bcff' }}>2ms</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
