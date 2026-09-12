'use client';

import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';

export function useDocumentStorage(documentId: string, editor: Editor | null) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('saved');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor || !documentId) return;

    const handleUpdate = () => {
      setSaveStatus('saving');
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        try {
          const html = editor.getHTML();
          localStorage.setItem('converge_doc_' + documentId, html);
          localStorage.setItem('converge_doc_' + documentId + '_updated', Date.now().toString());
          setSaveStatus('saved');
        } catch {
          setSaveStatus('idle');
        }
      }, 600);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editor, documentId]);

  return { saveStatus };
}
