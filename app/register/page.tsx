'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Code as Code2, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { signUpWithEmail } from '@/lib/supabase';

const perks = [
  '5 GB cloud workspace storage',
  'AI Debugger with 500 fixes/month',
  'Zero-config Python, JS, Java, C runtimes',
  'Real-time collaboration (up to 3 users)',
  'Community support & documentation',
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.replace('/home');
    }
  }, [router]);

  const passwordStrength = (): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { level: 3, label: 'Good', color: '#4ae176' };
    return { level: 4, label: 'Strong', color: '#4ae176' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    
    const result = await signUpWithEmail(email, password, fullName);
    
    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', fullName);
      router.push('/home');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0c1324' }}>
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div
          className="absolute top-1/3 right-0 w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4ae176 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d0bcff 0%, transparent 70%)' }}
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
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-5 font-grotesk"
              style={{ backgroundColor: 'rgba(74,225,118,0.08)', border: '1px solid rgba(74,225,118,0.2)', color: '#4ae176' }}
            >
              Free Forever Plan
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight" style={{ color: '#dce1fb' }}>
              Everything you need
              <br />
              <span className="text-gradient-tertiary">to start building</span>
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#cbc3d7' }}>
              Get your free workspace in seconds. No credit card required.
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'rgba(21,27,45,0.7)', border: '1px solid rgba(73,68,84,0.4)' }}
          >
            <div className="text-xs font-medium font-grotesk mb-4" style={{ color: '#cbc3d7' }}>
              STARTER PLAN INCLUDES:
            </div>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
                  >
                    <Check className="w-3 h-3" style={{ color: '#0c1324' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#dce1fb' }}>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {['AK', 'MJ', 'SR'].map((i, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-grotesk border-2"
                style={{
                  backgroundColor: idx === 1 ? '#4ae176' : '#d0bcff',
                  color: '#0c1324',
                  borderColor: '#0c1324',
                }}
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: '#cbc3d7' }}>
            Join <span style={{ color: '#4ae176' }}>50,000+</span> engineers already building with DevSphere
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 dot-grid opacity-20 lg:hidden" />

        <div className="relative z-10 w-full max-w-md py-8">
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
                Create your account
              </h1>
              <p className="text-sm" style={{ color: '#cbc3d7' }}>
                Start building with DevSphere in seconds
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="input-ds w-full px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>

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
                <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-ds w-full px-4 py-3 rounded-xl text-sm pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5"
                    style={{ color: '#cbc3d7' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: lvl <= strength.level ? strength.color : 'rgba(73,68,84,0.4)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="input-ds w-full px-4 py-3 rounded-xl text-sm pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/5"
                    style={{ color: '#cbc3d7' }}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                  <p className="text-xs mt-1.5" style={{ color: '#4ae176' }}>Passwords match</p>
                )}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#cbc3d7' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:underline transition-colors" style={{ color: '#d0bcff' }}>
                Login
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#cbc3d7' }}>
            By creating an account, you agree to our{' '}
            <a href="#" className="hover:underline" style={{ color: '#d0bcff' }}>Terms</a>
            {' '}and{' '}
            <a href="#" className="hover:underline" style={{ color: '#d0bcff' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
