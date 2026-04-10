'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0c1324' }}>
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}
