'use client';

import React, { useState, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import {
  ListTree,
  BarChart2,
  Sparkles,
  X,
  Hash,
  Clock,
  FileText,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { getAllTemplates, DocTemplate } from '../../../templates';
import { TableOfContentsHeading } from '../../types';

interface EditorSidebarProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: DocTemplate, mode: 'replace' | 'append') => void;
}

export function EditorSidebar({
  editor,
  isOpen,
  onClose,
  onApplyTemplate,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<'outline' | 'stats' | 'templates'>('outline');
  const templates = useMemo(() => getAllTemplates(), []);

  // Dynamic headings extraction
  const headings = useMemo<TableOfContentsHeading[]>(() => {
    if (!editor) return [];
    const items: TableOfContentsHeading[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        items.push({
          id: `heading-${pos}`,
          text: node.textContent || 'Untitled Heading',
          level: node.attrs.level || 1,
          pos,
        });
      }
    });
    return items;
  }, [editor, editor?.state.doc]);

  // Document statistics
  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0, readingTime: 1, paragraphs: 0 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    let paragraphs = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'paragraph' && node.textContent.trim().length > 0) {
        paragraphs++;
      }
    });

    return { words, chars, readingTime, paragraphs };
  }, [editor, editor?.state.doc]);

  if (!isOpen) return null;

  const scrollToPos = (pos: number) => {
    if (!editor) return;
    editor.commands.focus(pos);
    const domNode = editor.view.nodeDOM(pos);
    if (domNode instanceof HTMLElement) {
      domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="fixed top-14 left-0 bottom-10 z-30 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 shadow-xl flex flex-col animate-in slide-in-from-left duration-200 print:hidden select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('outline')}
            className={`px-2 py-1 rounded-lg transition ${
              activeTab === 'outline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Outline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-2 py-1 rounded-lg transition ${
              activeTab === 'stats' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-2 py-1 rounded-lg transition ${
              activeTab === 'templates' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Templates
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Close Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* TAB 1: OUTLINE */}
        {activeTab === 'outline' && (
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ListTree className="w-3.5 h-3.5" />
              <span>Table of Contents</span>
            </div>

            {headings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Hash className="w-6 h-6 mx-auto mb-2 opacity-40 text-slate-400" />
                <p>No headings found yet.</p>
                <p className="text-[11px] mt-1 text-slate-400">Add an H1, H2, or H3 to generate a table of contents.</p>
              </div>
            ) : (
              headings.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => scrollToPos(h.pos)}
                  style={{ paddingLeft: `${(h.level - 1) * 14 + 10}px` }}
                  className="w-full text-left py-1.5 pr-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition truncate flex items-center gap-1.5 group"
                >
                  <span
                    className={`font-mono text-[10px] font-bold shrink-0 ${
                      h.level === 1 ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    H{h.level}
                  </span>
                  <span className="truncate group-hover:font-medium">{h.text}</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* TAB 2: DOCUMENT STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Document Metrics</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-slate-900">{stats.words}</div>
                <div className="text-[11px] font-medium text-slate-500">Words</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-slate-900">{stats.chars}</div>
                <div className="text-[11px] font-medium text-slate-500">Characters</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-slate-900">{stats.paragraphs}</div>
                <div className="text-[11px] font-medium text-slate-500">Paragraphs</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-indigo-600">{stats.readingTime} min</div>
                <div className="text-[11px] font-medium text-slate-500">Reading Time</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs text-indigo-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Reading Speed</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                Calculated at an average adult reading comprehension rate of 200 words per minute.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: QUICK TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Insert Templates</span>
            </div>

            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-2.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{tpl.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onApplyTemplate(tpl, 'append')}
                    className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                  >
                    Insert Below
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Replace document content with ${tpl.title}?`)) {
                        onApplyTemplate(tpl, 'replace');
                      }
                    }}
                    className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
