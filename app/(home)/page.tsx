'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceView } from '@/components/workspace/workspace-view';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans antialiased text-slate-800">
        <header className="h-14 bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
              C
            </div>
            <span className="font-bold tracking-tight text-slate-900 text-xs">Converge</span>
          </div>
        </header>
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
          <div className="h-28 rounded-2xl bg-white border border-slate-200/80" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white border border-slate-200/80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <WorkspaceView />;
}
