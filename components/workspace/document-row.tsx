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
} from 'lucide-react';

interface DocumentRowProps {
  document: DocumentItem;
  currentUserId?: string;
  onRename: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function DocumentRow({
  document,
  currentUserId,
  onRename,
  onDelete,
}: DocumentRowProps) {
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
    <tr className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Title */}
      <td className="py-3 px-4">
        <Link
          href={`/documents/${document.id}`}
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <FileText className="size-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {document.title || 'Untitled Document'}
          </span>
        </Link>
      </td>

      {/* Role */}
      <td className="py-3 px-4 hidden sm:table-cell">
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
            isOwner
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900'
          }`}
        >
          {isOwner ? 'Owner' : 'Shared'}
        </span>
      </td>

      {/* Last Modified */}
      <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formattedDate}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger className="size-7 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition outline-none">
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
      </td>
    </tr>
  );
}
