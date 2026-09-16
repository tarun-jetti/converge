'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface RenameDialogProps {
  document: DocumentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
}

function RenameForm({
  document,
  onOpenChange,
  onRename,
}: {
  document: DocumentItem;
  onOpenChange: (open: boolean) => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(document.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onRename(document.id, title.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename document');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
      <DialogHeader className="space-y-1">
        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
          Rename Document
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
          Enter a new name for your collaborative document.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-1.5">
          <Label htmlFor="doc-title" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Document Title
          </Label>
          <Input
            id="doc-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 Architecture Proposal"
            required
            autoFocus
            className="h-9 text-sm"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !title.trim() || title === document.title}
            className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function RenameDialog({
  document,
  open,
  onOpenChange,
  onRename,
}: RenameDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <RenameForm
        key={document.id}
        document={document}
        onOpenChange={onOpenChange}
        onRename={onRename}
      />
    </Dialog>
  );
}
