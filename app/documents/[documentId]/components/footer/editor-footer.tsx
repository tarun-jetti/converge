'use client';

import React, { useMemo } from 'react';
import { Editor } from '@tiptap/react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Command, Sparkles } from 'lucide-react';

interface EditorFooterProps {
  editor: Editor | null;
  zoomLevel: number;
  onZoomChange: (level: number | ((prev: number) => number)) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function EditorFooter({
  editor,
  zoomLevel,
  onZoomChange,
  isFullscreen,
  onToggleFullscreen,
}: EditorFooterProps) {
  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, chars: text.length };
  }, [editor, editor?.state.doc]);

  return (
    <footer className="h-10 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 flex items-center justify-between z-30 select-none text-xs text-slate-500 print:hidden shadow-2xs">
      {/* Left: Document word/char count & Slash hint */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span>
            <strong className="text-slate-900 font-bold">{stats.words}</strong> words
          </span>
          <span className="text-slate-300">&bull;</span>
          <span>
            <strong className="text-slate-900 font-bold">{stats.chars}</strong> chars
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-500">
          <kbd className="font-mono font-bold text-slate-700 bg-white px-1 py-0.2 rounded border border-slate-200">
            /
          </kbd>
          <span>for commands</span>
        </div>
      </div>

      {/* Right: Zoom & Fullscreen */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => onZoomChange((z) => Math.max(50, z - 10))}
            className="hover:text-slate-900 transition p-0.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(100)}
            className="font-mono text-[11px] font-semibold text-slate-700 min-w-[36px] text-center hover:text-indigo-600 transition"
            title="Reset Zoom (100%)"
          >
            {zoomLevel}%
          </button>
          <button
            type="button"
            onClick={() => onZoomChange((z) => Math.min(150, z + 10))}
            className="hover:text-slate-900 transition p-0.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </footer>
  );
}
