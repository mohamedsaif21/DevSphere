'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Code as Code2, Eye, EyeOff, ArrowRight, Zap, Brain, Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.replace('/home');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0c1324' }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d0bcff 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4ae176 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
          >
            <Code2 className="w-5 h-5" style={{ color: '#0c1324' }} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#dce1fb' }}>
            Dev<span className="text-gradient-primary">Sphere</span>
          </span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: '#dce1fb' }}>
              The future of
              <br />
              <span className="text-gradient-primary">cloud development</span>
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#cbc3d7' }}>
              Build, debug, and deploy at light speed. Your entire dev environment, anywhere.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Brain, color: '#d0bcff', bg: 'rgba(208,188,255,0.1)', border: 'rgba(208,188,255,0.2)', title: 'AI-Powered Debugging', desc: 'Fixes errors before you even run your code.' },
              { icon: Zap, color: '#4ae176', bg: 'rgba(74,225,118,0.1)', border: 'rgba(74,225,118,0.2)', title: 'Sub-400ms Cold Starts', desc: 'Pre-warmed Monolith instances always ready.' },
              { icon: Globe, color: '#d0bcff', bg: 'rgba(208,188,255,0.1)', border: 'rgba(208,188,255,0.2)', title: 'Global Edge Network', desc: '42 nodes worldwide. Zero latency development.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(21,27,45,0.6)', border: `1px solid ${item.border}` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: '#dce1fb' }}>{item.title}</div>
                  <div className="text-xs" style={{ color: '#cbc3d7' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ backgroundColor: 'rgba(74,225,118,0.08)', border: '1px solid rgba(74,225,118,0.2)', color: '#4ae176' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4ae176' }} />
            All systems operational
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 dot-grid opacity-20 lg:hidden" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
            >
              <Code2 className="w-5 h-5" style={{ color: '#0c1324' }} />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#dce1fb' }}>
              Dev<span className="text-gradient-primary">Sphere</span>
            </span>
          </div>

          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.5)' }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: '#dce1fb' }}>
                Welcome back
              </h1>
              <p className="text-sm" style={{ color: '#cbc3d7' }}>
                Sign in to access your DevSphere workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-ds w-full px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium font-grotesk" style={{ color: '#cbc3d7' }}>
                    Password
                  </label>
                  <a href="#" className="text-xs hover:underline transition-colors" style={{ color: '#d0bcff' }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-ds w-full px-4 py-3 rounded-xl text-sm pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: '#cbc3d7' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f87171' }} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-cta w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ color: '#0c1324' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#cbc3d7' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium hover:underline transition-colors" style={{ color: '#d0bcff' }}>
                Register
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#cbc3d7' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="hover:underline" style={{ color: '#d0bcff' }}>Terms</a>
            {' '}and{' '}
            <a href="#" className="hover:underline" style={{ color: '#d0bcff' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
