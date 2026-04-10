'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Code as Code2 } from 'lucide-react';

export default function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/compiler');
  };
  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(208,188,255,0.07) 0%, rgba(74,225,118,0.04) 40%, transparent 70%)' }}
      />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto"
          style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
        >
          <Code2 className="w-8 h-8" style={{ color: '#0c1324' }} />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ color: '#dce1fb' }}>
          Start building with{' '}
          <span className="text-gradient-primary">DevSphere</span>
          {' '}today
        </h2>

        <p className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ color: '#cbc3d7' }}>
          Join over 50,000 engineers who have already made the switch to the next generation of cloud development.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="btn-cta px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
            style={{ color: '#0c1324' }}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            href="/login"
            className="btn-outline-ds px-8 py-4 rounded-xl text-base font-medium w-full sm:w-auto text-center"
          >
            Sign In
          </Link>
        </div>

        <p className="text-xs mt-6" style={{ color: '#cbc3d7' }}>
          No credit card required. Free forever on the Starter plan.
        </p>
      </div>
    </section>
  );
}
