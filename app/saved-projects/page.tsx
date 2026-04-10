'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserSavedCodes, deleteCode } from '@/lib/savedCodeService';
import { SavedCode } from '@/types/savedCode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, Code as CodeIcon, Calendar, FileText } from 'lucide-react';

export default function SavedProjectsPage() {
  const router = useRouter();
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }
        setUser(user);

        // Fetch saved codes
        const result = await getUserSavedCodes(user.id);
        if (result.success) {
          setSavedCodes(result.data || []);
        } else {
          setError(result.error);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load saved projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return;

    setDeleting(id);
    const result = await deleteCode(id);

    if (result.success) {
      setSavedCodes(savedCodes.filter((code) => code.id !== id));
    } else {
      setError(result.error);
    }
    setDeleting(null);
  };

  const handleOpen = (code: SavedCode) => {
    // Store the code in session to load in compiler
    sessionStorage.setItem('loadCode', JSON.stringify(code));
    // Use simple push to compiler page
    router.push('/compiler');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      python: '#3776ab',
      javascript: '#f7df1e',
      java: '#007396',
      cpp: '#00599c',
      c: '#a8b9cc',
      go: '#00add8',
    };
    return colors[lang.toLowerCase()] || '#6b7280';
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0c1324' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#dce1fb' }}>
            Saved Projects
          </h1>
          <p style={{ color: '#cbc3d7' }}>View and manage all your saved code snippets</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4ae176', animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#d0bcff', animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#4ae176', animationDelay: '300ms' }} />
            </div>
          </div>
        ) : error ? (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f87171' }} />
            {error}
          </div>
        ) : savedCodes.length === 0 ? (
          <div className="text-center py-20">
            <CodeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#cbc3d7' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#dce1fb' }}>
              No saved projects yet
            </h3>
            <p style={{ color: '#cbc3d7' }}>Start coding and save your projects to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCodes.map((code) => (
              <div
                key={code.id}
                className="rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg"
                style={{
                  backgroundColor: '#151b2d',
                  border: '1px solid rgba(73,68,84,0.3)',
                }}
                onClick={() => handleOpen(code)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getLanguageColor(code.language) }}
                      />
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(74,225,118,0.1)', color: '#4ae176' }}>
                        {code.language}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm leading-tight" style={{ color: '#dce1fb' }}>
                      {code.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      code.id && handleDelete(code.id);
                    }}
                    disabled={deleting === code.id}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50"
                    style={{ color: '#f87171' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {code.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: '#cbc3d7' }}>
                    {code.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs" style={{ color: '#9ca3af' }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(code.created_at || '')}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {code.code.split('\n').length} lines
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
