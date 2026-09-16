'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, RefreshCw, Loader2 } from 'lucide-react';

interface DocumentControlsProps {
  totalCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onCreateDocument: () => void;
  onRefresh: () => void;
  isCreating: boolean;
  isLoading: boolean;
}

export function DocumentControls({
  totalCount,
  viewMode,
  onViewModeChange,
  onCreateDocument,
  onRefresh,
  isCreating,
  isLoading,
}: DocumentControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
          Recent documents
        </h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Refresh button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="size-8 p-0 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          title="Refresh list"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        {/* View mode toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="List view"
          >
            <List className="size-3.5" />
          </button>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={onCreateDocument}
          disabled={isCreating}
          size="sm"
          className="h-8 gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          {isCreating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          <span>New Document</span>
        </Button>
      </div>
    </div>
  );
}
