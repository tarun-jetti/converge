'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDown, Minus, Plus } from 'lucide-react';

interface FontSizeSelectProps {
  editor: Editor | null;
  currentSize: string;
}

const FONT_SIZES = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '30', value: '30px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
];

export function FontSizeSelect({ editor, currentSize }: FontSizeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!editor) return null;

  const handleSelect = (size: string) => {
    setIsOpen(false);
    (editor.chain().focus() as any).setFontSize(size).run();
  };

  const handleStep = (delta: number) => {
    const num = parseInt(currentSize) || 16;
    const next = Math.max(8, Math.min(72, num + delta)) + 'px';
    (editor.chain().focus() as any).setFontSize(next).run();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-0.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl px-1 py-0.5 select-none transition-colors"
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleStep(-2)}
        className="w-5 h-5 rounded hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 transition active:scale-95"
        title="Decrease font size"
      >
        <Minus className="w-2.5 h-2.5" />
      </button>

      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsOpen(!isOpen)}
          className="px-1.5 py-0.5 text-xs font-mono font-bold text-slate-800 hover:bg-slate-200/70 rounded flex items-center gap-0.5 transition"
          title="Font Size"
        >
          <span>{parseInt(currentSize) || 16}</span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-20 bg-white border border-slate-200 shadow-xl rounded-xl p-1 z-50 animate-in fade-in zoom-in-95 max-h-48 overflow-y-auto">
            {FONT_SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s.value)}
                className={`w-full text-center py-1 text-xs rounded-lg transition font-mono ${
                  currentSize === s.value
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleStep(2)}
        className="w-5 h-5 rounded hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 transition active:scale-95"
        title="Increase font size"
      >
        <Plus className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
