'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Palette, Highlighter } from 'lucide-react';

interface ColorPickerPopoverProps {
  editor: Editor | null;
}

const TEXT_COLORS = [
  { label: 'Default', value: '#0f172a' },
  { label: 'Slate', value: '#64748b' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'none' },
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Purple', value: '#e9d5ff' },
  { label: 'Pink', value: '#fbcfe8' },
  { label: 'Orange', value: '#fed7aa' },
];

export function ColorPickerPopover({ editor }: ColorPickerPopoverProps) {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (textRef.current && !textRef.current.contains(event.target as Node)) {
        setShowTextColor(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(event.target as Node)) {
        setShowHighlight(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const applyColor = (hex: string) => {
    if (hex === '#0f172a') {
      (editor.chain().focus() as any).unsetColor().run();
    } else {
      (editor.chain().focus() as any).setColor(hex).run();
    }
    setShowTextColor(false);
  };

  const applyHighlight = (hex: string) => {
    if (hex === 'none') {
      (editor.chain().focus() as any).unsetHighlight().run();
    } else {
      (editor.chain().focus() as any).toggleHighlight({ color: hex }).run();
    }
    setShowHighlight(false);
  };

  return (
    <div className="flex items-center gap-0.5">
      {/* Text Color Picker */}
      <div className="relative" ref={textRef}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowTextColor(!showTextColor);
            setShowHighlight(false);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            showTextColor
              ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </button>

        {showTextColor && (
          <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Text Color
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyColor(c.value)}
                  className="w-6 h-6 rounded-full border border-slate-200/80 hover:scale-110 transition shadow-2xs"
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Highlighter Picker */}
      <div className="relative" ref={highlightRef}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowHighlight(!showHighlight);
            setShowTextColor(false);
          }}
          className={`p-1.5 rounded-lg transition-all ${
            showHighlight
              ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Highlight Color"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {showHighlight && (
          <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Highlight Color
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyHighlight(c.value)}
                  className="h-6 rounded-md border border-slate-200/80 hover:scale-105 transition flex items-center justify-center text-[10px] font-semibold"
                  style={{ backgroundColor: c.value === 'none' ? '#f1f5f9' : c.value }}
                  title={c.label}
                >
                  {c.value === 'none' ? 'None' : ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
