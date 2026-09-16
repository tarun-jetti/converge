'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Clock,
} from 'lucide-react';

interface DocumentCardProps {
  document: DocumentItem;
  currentUserId?: string;
  onRename: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function DocumentCard({
  document,
  currentUserId,
  onRename,
  onDelete,
}: DocumentCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const isOwner = currentUserId ? document.ownerId === currentUserId : true;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/documents/${document.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (() => {
    try {
      return formatDistanceToNow(new Date(document.updatedAt || document.createdAt), {
        addSuffix: true,
      });
    } catch {
      return 'recently';
    }
  })();

  return (
    <div className="group relative rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Preview Canvas */}
      <Link
        href={`/documents/${document.id}`}
        className="block p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/80 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/80 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
            <FileText className="size-4" />
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
              isOwner
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900'
            }`}
          >
            {isOwner ? 'Owner' : 'Shared'}
          </span>
        </div>

        {/* Mock content lines to look like an authentic document thumbnail */}
        <div className="space-y-1.5 opacity-60">
          <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </Link>

      {/* Card Info Bottom */}
      <div className="p-3.5 flex items-center justify-between gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="flex-1 min-w-0"
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {document.title || 'Untitled Document'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            <Clock className="size-3 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
        </Link>

        {/* 3-Dots Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition outline-none">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1">
            <DropdownMenuItem
              onClick={() => router.push(`/documents/${document.id}`)}
              className="text-xs cursor-pointer gap-2 py-1.5"
            >
              <ExternalLink className="size-3.5 text-slate-500" />
              <span>Open Document</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCopyLink}
              className="text-xs cursor-pointer gap-2 py-1.5"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Copy className="size-3.5 text-slate-500" />
              )}
              <span>{copied ? 'Copied URL' : 'Copy Link'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRename(document)}
              className="text-xs cursor-pointer gap-2 py-1.5"
            >
              <Edit2 className="size-3.5 text-slate-500" />
              <span>Rename Title</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => onDelete(document)}
              className="text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer gap-2 py-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
