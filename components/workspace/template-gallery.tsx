'use client';

import React from 'react';
import { TemplateItem } from '@/lib/types';
import { Plus, FileCode2, Users2, Compass, ClipboardCheck, Sparkles } from 'lucide-react';

export const WORKSPACE_TEMPLATES: TemplateItem[] = [
  {
    id: 'blank',
    name: 'Blank document',
    description: 'Start fresh with an empty collaborative canvas',
    defaultTitle: 'Untitled Document',
    category: 'General',
  },
  {
    id: 'spec',
    name: 'Engineering Spec',
    description: 'System architecture, API contracts, and trade-offs',
    defaultTitle: 'RFC: System Architecture Spec',
    category: 'Engineering',
    badge: 'Popular',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Discussion agenda, decisions made, and action items',
    defaultTitle: 'Weekly Team Sync — Notes',
    category: 'Team',
  },
  {
    id: 'retro',
    name: 'Sprint Retrospective',
    description: 'What went well, challenges faced, and improvements',
    defaultTitle: 'Sprint Retrospective',
    category: 'Agile',
  },
  {
    id: 'prd',
    name: 'Product Spec (PRD)',
    description: 'User problem, product scope, and success metrics',
    defaultTitle: 'PRD: Next-Gen Features',
    category: 'Product',
  },
];

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateItem) => void;
  isCreating: boolean;
}

export function TemplateGallery({ onSelectTemplate, isCreating }: TemplateGalleryProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'blank':
        return <Plus className="size-5 text-indigo-600 dark:text-indigo-400" />;
      case 'spec':
        return <FileCode2 className="size-5 text-sky-600 dark:text-sky-400" />;
      case 'meeting':
        return <Users2 className="size-5 text-amber-600 dark:text-amber-400" />;
      case 'retro':
        return <Compass className="size-5 text-emerald-600 dark:text-emerald-400" />;
      case 'prd':
        return <ClipboardCheck className="size-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Plus className="size-5 text-indigo-600" />;
    }
  };

  return (
    <section className="py-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Start a new document
            </h2>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
              <Sparkles className="size-2.5" /> Quick Start
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {WORKSPACE_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              disabled={isCreating}
              onClick={() => onSelectTemplate(tpl)}
              className="group text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-150 flex flex-col justify-between h-32 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <div className="flex items-start justify-between w-full">
                <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors">
                  {getIcon(tpl.id)}
                </div>
                {tpl.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                    {tpl.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {tpl.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {tpl.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
