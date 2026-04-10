'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SaveCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
  isLoading?: boolean;
}

export default function SaveCodeModal({ isOpen, onClose, onSave, isLoading = false }: SaveCodeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      await onSave(title, description);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="rounded-2xl p-8 w-full max-w-md"
        style={{ backgroundColor: '#151b2d', border: '1px solid rgba(73,68,84,0.5)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#dce1fb' }}>
            Save Code
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            style={{ color: '#cbc3d7' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fibonacci Algorithm"
              className="input-ds w-full px-4 py-2 rounded-xl text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 font-grotesk" style={{ color: '#cbc3d7' }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description..."
              className="input-ds w-full px-4 py-2 rounded-xl text-sm resize-none"
              rows={3}
              disabled={isLoading}
              style={{ color: '#dce1fb' }}
            />
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(73,68,84,0.2)',
                color: '#cbc3d7',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-cta py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ color: '#0c1324' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Code'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
