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
import { DocumentItem } from '@/lib/types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteDialogProps {
  document: DocumentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteDialog({
  document,
  open,
  onOpenChange,
  onDelete,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!document) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(document.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Delete document?
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;{document?.title}&rdquo;</span>? This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">{error}</p>
        )}

        <DialogFooter className="gap-2 sm:gap-0 mt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
