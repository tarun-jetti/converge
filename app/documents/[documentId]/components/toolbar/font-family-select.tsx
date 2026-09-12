'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';

interface FontFamilySelectProps {
  editor: Editor | null;
  currentFont: string;
}

const FONT_FAMILIES = [
  { label: 'Default Sans', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'Merriweather, Georgia, serif' },
  { label: 'Monospace', value: 'JetBrains Mono, monospace' },
  { label: 'Casual', value: 'Comic Sans MS, cursive' },
];

export function FontFamilySelect({ editor, currentFont }: FontFamilySelectProps) {
  if (!editor) return null;

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentFont}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            editor.chain().focus().setFontFamily(val).run();
          } else {
            editor.chain().focus().unsetFontFamily().run();
          }
        }}
        className="appearance-none bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-800 py-1.5 pl-2.5 pr-6 rounded-xl border border-slate-200/80 outline-none cursor-pointer transition-colors max-w-[130px] truncate shadow-2xs"
        title="Font Family"
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
    </div>
  );
}
