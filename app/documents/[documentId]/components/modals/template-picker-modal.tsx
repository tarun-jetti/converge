'use client';

import React, { useState, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import {
  Sparkles,
  X,
  Search,
  FileText,
  Briefcase,
  CheckCircle2,
  Code,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getAllTemplates, DocTemplate } from '../../../templates';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  onSelectTemplate: (template: DocTemplate, mode: 'replace' | 'append') => void;
}

const CATEGORIES = [
  { label: 'All Templates', value: 'all' },
  { label: 'Professional', value: 'Professional' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Management', value: 'Management' },
];

export function TemplatePickerModal({
  isOpen,
  onClose,
  editor,
  onSelectTemplate,
}: TemplatePickerModalProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<DocTemplate | null>(null);

  const templates = useMemo(() => getAllTemplates(), []);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      const matchQuery =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [templates, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[620px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Document Templates</h3>
              <p className="text-[11px] text-slate-400">Choose a crafted starting structure for your work</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === c.value
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        {/* Body Split View: Grid & Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Templates Grid */}
          <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtered.map((t) => {
              const isSelected = previewTemplate?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setPreviewTemplate(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{t.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(t, 'replace');
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition active:scale-95 shadow-2xs"
                    >
                      Use Template
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(t, 'append');
                        onClose();
                      }}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Drawer: Live Preview */}
          {previewTemplate && (
            <div className="w-80 border-l border-slate-100 p-5 bg-slate-50/50 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    Preview
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    {previewTemplate.category}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {previewTemplate.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {previewTemplate.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(previewTemplate, 'replace');
                    onClose();
                  }}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Apply & Replace Content
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(previewTemplate, 'append');
                    onClose();
                  }}
                  className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Insert at Cursor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
