'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { deleteCode, getUserSavedCodes } from '@/lib/savedCodeService';
import { SavedCode } from '@/types/savedCode';

interface ProjectRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  status?: 'Active' | 'Warning';
  alerts?: number;
  accentColor: string;
  raw: SavedCode;
}

const iconForLanguage = (lang: string) => {
  const l = (lang || '').toLowerCase();
  if (l.includes('python')) return 'terminal';
  if (l.includes('javascript') || l.includes('typescript')) return 'javascript';
  if (l === 'go') return 'data_object';
  if (l === 'java') return 'coffee';
  if (l === 'cpp' || l === 'c++') return 'memory';
  if (l === 'c') return 'code';
  return 'description';
};

const accentForLanguage = (lang: string) => {
  const l = (lang || '').toLowerCase();
  if (l.includes('python')) return 'text-tertiary';
  if (l.includes('javascript') || l.includes('typescript')) return 'text-primary-fixed-dim';
  if (l === 'go') return 'text-secondary-fixed-dim';
  if (l === 'java') return 'text-tertiary';
  return 'text-on-surface-variant/60';
};

const ProjectExplorer: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setSavedCodes([]);
          setError('Please sign in to view your saved projects.');
          return;
        }
        const result = await getUserSavedCodes(user.id);
        if (result.success) {
          setSavedCodes(result.data || []);
        } else {
          setError(result.error);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load saved projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const projects: ProjectRow[] = useMemo(() => {
    return (savedCodes || []).map((code) => ({
      id: code.id || `${code.title}-${code.created_at || ''}`,
      name: code.title,
      description: `${code.language}${code.description ? ` • ${code.description}` : ''}`,
      icon: iconForLanguage(code.language),
      status: 'Active',
      accentColor: accentForLanguage(code.language),
      raw: code,
    }));
  }, [savedCodes]);

  const handleOpen = (code: SavedCode) => {
    sessionStorage.setItem('loadCode', JSON.stringify(code));
    router.push('/compiler');
  };

  const handleDelete = async (code: SavedCode) => {
    if (!code.id) return;
    if (!confirm('Are you sure you want to delete this code?')) return;

    setDeletingId(code.id);
    const result = await deleteCode(code.id);
    if (result.success) {
      setSavedCodes((prev) => prev.filter((c) => c.id !== code.id));
    } else {
      setError(result.error);
    }
    setDeletingId(null);
  };

  return (
    <div className="relative bg-surface-dim text-on-surface font-body antialiased min-h-screen flex flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(208,188,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(74,225,118,0.10) 0%, transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-10" />
      {/* Top NavBar */}
      <header className="relative bg-[#0c1324] text-[#4ae176] h-14 border-b border-white/5 flex justify-between items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-[#dce1fb] tracking-tighter">DevSphere</span>
        </div>
      </header>

      {/* Content Canvas */}
      <main className="relative max-w-5xl mx-auto w-full p-8 flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Project Explorer</h1>
            <nav className="flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant/60">
              <span>Workspaces</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-tertiary">All Files</span>
            </nav>
          </div>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl text-on-surface-variant/60">
              Loading saved projects...
            </div>
          ) : error ? (
            <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl text-error">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-surface-container-low border border-white/5 p-6 rounded-2xl text-on-surface-variant/60">
              No saved projects yet. Go to the compiler and click Save.
            </div>
          ) : projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-surface-container-low/70 backdrop-blur border border-white/5 p-6 rounded-2xl hover:border-tertiary/20 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-white/10 ${project.accentColor}`}>
                  <span className="material-symbols-outlined text-3xl">{project.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-tertiary transition-colors">{project.name}</h3>
                  <p className="text-sm text-on-surface-variant/60 font-label">{project.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {project.status === 'Active' && (
                  <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-label uppercase tracking-widest rounded border border-tertiary/20">
                    Active
                  </span>
                )}
                
                {project.alerts && (
                  <span className="text-error/60 text-xs font-label flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {project.alerts} security alerts
                  </span>
                )}

                {!!project.raw.id && (
                  <button
                    onClick={() => handleDelete(project.raw)}
                    disabled={deletingId === project.raw.id}
                    className="px-3 py-2 font-bold text-xs font-label uppercase rounded-xl transition-all border border-white/10 hover:border-red-500/30 text-error disabled:opacity-60"
                  >
                    {deletingId === project.raw.id ? 'Deleting...' : 'Delete'}
                  </button>
                )}

                <button
                  onClick={() => handleOpen(project.raw)}
                  className={`px-6 py-2 font-bold text-xs font-label uppercase rounded-xl transition-all flex items-center gap-2 
                  ${project.status === 'Active' 
                    ? 'bg-tertiary text-on-tertiary-fixed hover:brightness-110' 
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-bright border border-white/5'}`}>
                  {project.status === 'Active' ? 'Open in Editor' : 'Open'}
                  {project.status === 'Active' && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
              </div>
            </div>
          ))}

          {/* Add New Project */}
          <div className="group border-2 border-dashed border-white/5 p-4 rounded-2xl flex items-center justify-center gap-4 hover:border-tertiary/40 hover:bg-tertiary/5 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-tertiary">add</span>
            <p className="font-bold text-sm">Create New Project</p>
          </div>
        </div>
      </main>

      {/* System Status Bar */}
      <footer className="h-8 bg-surface-container-lowest border-t border-white/5 flex items-center justify-between px-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>System Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span>12 ms Latency</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>US-EAST-1</span>
          <span>v2.4.0-stable</span>
        </div>
      </footer>
    </div>
  );
};

export default ProjectExplorer;