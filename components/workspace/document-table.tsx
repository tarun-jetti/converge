'use client';

import React from 'react';
import { DocumentItem } from '@/lib/types';
import { DocumentRow } from './document-row';

interface DocumentTableProps {
  documents: DocumentItem[];
  currentUserId?: string;
  onRename: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function DocumentTable({
  documents,
  currentUserId,
  onRename,
  onDelete,
}: DocumentTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-4">Title</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Role</th>
              <th className="py-2.5 px-4">Last Modified</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                currentUserId={currentUserId}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
