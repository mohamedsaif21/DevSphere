'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Code as Code2, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  showAuthLinks?: boolean;
}

export default function Navbar({ showAuthLinks = true }: NavbarProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #4ae176 0%, #00a74b 100%)' }}
            >
              <Code2 className="w-4 h-4" style={{ color: '#0c1324' }} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: '#dce1fb' }}>
              Dev<span className="text-gradient-primary">Sphere</span>
            </span>
          </Link>



          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="btn-outline-ds px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Logout
                </button>
                <button
                  className="btn-cta px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                  style={{ color: '#0c1324' }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Start Exploring
                </button>
              </>
            ) : showAuthLinks ? (
              <>
                <Link
                  href="/login"
                  className="btn-outline-ds px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-cta px-4 py-2 rounded-xl text-sm"
                  style={{ color: '#0c1324' }}
                >
                  Get Started
                </Link>
              </>
            ) : null}
          </div>

          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#cbc3d7' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden glass-card mx-4 mb-4 rounded-2xl p-4 flex flex-col gap-3"
        >
          {['Features', 'Pricing', 'Docs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium py-2 px-3 rounded-xl transition-colors hover:bg-ds-surface-high"
              style={{ color: '#cbc3d7' }}
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: 'rgba(73,68,84,0.3)' }}>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="btn-outline-ds w-full py-2.5 rounded-xl text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-outline-ds w-full py-2.5 rounded-xl text-sm font-medium text-center">
                  Sign In
                </Link>
                <Link href="/register" className="btn-cta w-full py-2.5 rounded-xl text-sm text-center" style={{ color: '#0c1324' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
