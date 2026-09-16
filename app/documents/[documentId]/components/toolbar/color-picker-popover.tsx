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
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);

  const saveSelection = () => {
    if (editor && editor.state) {
      const { from, to } = editor.state.selection;
      savedSelectionRef.current = { from, to };
    }
  };

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
    setShowTextColor(false);
    if (!editor) return;

    const chain = editor.chain().focus();
    if (savedSelectionRef.current && savedSelectionRef.current.from !== savedSelectionRef.current.to) {
      chain.setTextSelection(savedSelectionRef.current);
    }

    if (hex === '#0f172a' || hex === 'default') {
      (chain as any).unsetColor().run();
    } else {
      (chain as any).setColor(hex).run();
    }
  };

  const applyHighlight = (hex: string) => {
    setShowHighlight(false);
    if (!editor) return;

    const chain = editor.chain().focus();
    if (savedSelectionRef.current && savedSelectionRef.current.from !== savedSelectionRef.current.to) {
      chain.setTextSelection(savedSelectionRef.current);
    }

    if (hex === 'none') {
      (chain as any).unsetHighlight().run();
    } else {
      (chain as any).setHighlight({ color: hex }).run();
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {/* Text Color Picker */}
      <div className="relative" ref={textRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveSelection();
            setShowTextColor((prev) => !prev);
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
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 select-none"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Text Color
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {TEXT_COLORS.map((c) => {
                const isSelected = c.value === '#0f172a'
                  ? !editor.isActive('textStyle')
                  : editor.isActive('textStyle', { color: c.value });
                return (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyColor(c.value);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyColor(c.value);
                    }}
                    className={`w-6 h-6 rounded-full border transition shadow-2xs ${
                      isSelected ? 'ring-2 ring-indigo-600 scale-110 border-white' : 'border-slate-200/80 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Highlighter Picker */}
      <div className="relative" ref={highlightRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveSelection();
            setShowHighlight((prev) => !prev);
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
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 select-none"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Highlight Color
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => {
                const isSelected = c.value === 'none'
                  ? !editor.isActive('highlight')
                  : editor.isActive('highlight', { color: c.value });
                return (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyHighlight(c.value);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      applyHighlight(c.value);
                    }}
                    className={`h-6 rounded-md border transition flex items-center justify-center text-[10px] font-semibold ${
                      isSelected ? 'ring-2 ring-indigo-600 scale-105 border-indigo-400' : 'border-slate-200/80 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value === 'none' ? '#f1f5f9' : c.value }}
                    title={c.label}
                  >
                    {c.value === 'none' ? 'None' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
