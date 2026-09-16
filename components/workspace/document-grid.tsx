'use client';

import React from 'react';
import { DocumentItem } from '@/lib/types';
import { DocumentCard } from './document-card';

interface DocumentGridProps {
  documents: DocumentItem[];
  currentUserId?: string;
  onRename: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
}

export function DocumentGrid({
  documents,
  currentUserId,
  onRename,
  onDelete,
}: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          currentUserId={currentUserId}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
