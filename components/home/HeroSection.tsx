'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play } from 'lucide-react';
import IDEMockup from './IDEMockup';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/compiler');
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40" />

      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #d0bcff 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4ae176 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium font-grotesk"
            style={{
              backgroundColor: 'rgba(74,225,118,0.08)',
              border: '1px solid rgba(74,225,118,0.2)',
              color: '#4ae176'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4ae176' }} />
            Version 4.0 Stability Patch Live
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
            <span style={{ color: '#dce1fb' }}>Code </span>
            <span className="text-gradient-primary">faster</span>
            <span style={{ color: '#dce1fb' }}>.</span>
            <br />
            <span style={{ color: '#dce1fb' }}>Debug </span>
            <span className="text-gradient-tertiary">smarter</span>
            <span style={{ color: '#dce1fb' }}>.</span>
            <br />
            <span style={{ color: '#dce1fb' }}>Build better.</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: '#cbc3d7' }}
          >
            The next-generation cloud compiler built for the editorial engineer. Experience speed, precision, and the power of AI-driven development.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="btn-cta px-7 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ color: '#0c1324' }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="btn-outline-ds px-7 py-3.5 rounded-xl text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Play className="w-4 h-4" style={{ color: '#d0bcff' }} />
              View Live Demo
            </button>
          </div>

        </div>

        <IDEMockup />
      </div>
    </section>
  );
}
