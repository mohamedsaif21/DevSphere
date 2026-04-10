'use client';

import { useRouter } from 'next/navigation';
import { Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const metrics = [
  { label: 'Avg Compile Time', value: '280ms', suffix: '', color: '#4ae176' },
  { label: 'Global Edge Nodes', value: '42', suffix: '+', color: '#d0bcff' },
  { label: 'Security Level', value: 'AES-256', suffix: '', color: '#4ae176' },
  { label: 'Cold Start Time', value: '<400', suffix: 'ms', color: '#d0bcff' },
];

const features = [
  {
    icon: Zap,
    iconColor: '#4ae176',
    iconBg: 'rgba(74,225,118,0.1)',
    iconBorder: 'rgba(74,225,118,0.2)',
    title: 'Instant Cold Starts',
    description: 'Environments launch in under 400ms using pre-warmed Monolith instances.',
  },
  {
    icon: Shield,
    iconColor: '#d0bcff',
    iconBg: 'rgba(208,188,255,0.1)',
    iconBorder: 'rgba(208,188,255,0.2)',
    title: 'End-to-End Encryption',
    description: 'Your source code is encrypted at rest and in transit with post-quantum security.',
  },
];

export default function PerformanceSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/compiler');
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,225,118,0.08) 0%, transparent 60%)' }}
      />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 font-grotesk"
              style={{ backgroundColor: 'rgba(74,225,118,0.08)', border: '1px solid rgba(74,225,118,0.15)', color: '#4ae176' }}
            >
              <Globe className="w-3 h-3" />
              Global Infrastructure
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              <span style={{ color: '#dce1fb' }}>Beyond the Cloud.</span>
              <br />
              <span className="text-gradient-tertiary">Native Performance.</span>
            </h2>

            <p className="text-base leading-relaxed mb-10" style={{ color: '#cbc3d7' }}>
              Our proprietary Kinetic Engine uses edge computing to distribute compilation tasks globally. Experience 0ms latency whether you&apos;re in Tokyo or New York.
            </p>

            <div className="space-y-5 mb-10">
              {features.map((feat) => (
                <div
                  key={feat.title}
                  className="flex items-start gap-4 p-4 rounded-xl group transition-all duration-200 hover:scale-[1.01]"
                  style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.4)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: feat.iconBg, border: `1px solid ${feat.iconBorder}` }}
                  >
                    <feat.icon className="w-4 h-4" style={{ color: feat.iconColor }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: '#dce1fb' }}>{feat.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: '#cbc3d7' }}>{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGetStarted}
              className="btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ color: '#0c1324' }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl opacity-40 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(74,225,118,0.15) 0%, rgba(208,188,255,0.08) 50%, transparent 100%)' }}
            />

            <div
              className="relative rounded-2xl p-8"
              style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.4)' }}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl p-4 text-center"
                    style={{ backgroundColor: '#0c1324', border: '1px solid rgba(73,68,84,0.3)' }}
                  >
                    <div className="text-2xl font-extrabold font-grotesk" style={{ color: m.color }}>
                      {m.value}
                      <span className="text-sm">{m.suffix}</span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#cbc3d7' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: '#0c1324', border: '1px solid rgba(73,68,84,0.3)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-grotesk font-medium" style={{ color: '#cbc3d7' }}>Global Request Distribution</span>
                  <span className="text-xs font-mono" style={{ color: '#4ae176' }}>LIVE</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { region: 'North America', load: 34, color: '#d0bcff' },
                    { region: 'Europe', load: 28, color: '#4ae176' },
                    { region: 'Asia Pacific', load: 26, color: '#d0bcff' },
                    { region: 'Other', load: 12, color: '#4ae176' },
                  ].map((r) => (
                    <div key={r.region}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs" style={{ color: '#cbc3d7' }}>{r.region}</span>
                        <span className="text-xs font-mono" style={{ color: r.color }}>{r.load}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(73,68,84,0.4)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${r.load}%`,
                            background: `linear-gradient(90deg, ${r.color}, ${r.color}99)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Uptime', value: '99.99%', color: '#4ae176' },
                  { label: 'P99 Latency', value: '12ms', color: '#d0bcff' },
                  { label: 'Daily Compiles', value: '4.2M', color: '#4ae176' },
                ].map((s) => (
                  <div key={s.label} className="text-center py-2">
                    <div className="text-sm font-bold font-grotesk" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#cbc3d7' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
