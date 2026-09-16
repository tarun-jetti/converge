'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, SearchX } from 'lucide-react';

interface DocumentEmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onCreateDocument: () => void;
  isCreating: boolean;
}

export function DocumentEmptyState({
  searchQuery,
  onClearSearch,
  onCreateDocument,
  isCreating,
}: DocumentEmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <SearchX className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          No documents found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
          We couldn&apos;t find any documents matching &ldquo;{searchQuery}&rdquo;. Try another keyword or clear your filter.
        </p>
        {onClearSearch && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSearch}
            className="text-xs h-8"
          >
            Clear search filter
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400 shadow-xs">
        <FileText className="size-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        No documents in this workspace yet
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
        Get started by creating your first document or choosing one of the quick-start templates above.
      </p>
      <Button
        onClick={onCreateDocument}
        disabled={isCreating}
        size="sm"
        className="h-8.5 gap-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
      >
        <Plus className="size-4" />
        <span>Create blank document</span>
      </Button>
    </div>
  );
}
