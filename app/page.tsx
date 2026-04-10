'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center dot-grid"
      style={{ backgroundColor: '#0c1324' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4ae176', animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d0bcff', animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4ae176', animationDelay: '300ms' }} />
      </div>
    </div>
  );
}