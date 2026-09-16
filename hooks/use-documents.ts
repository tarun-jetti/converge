'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentItem } from '@/lib/types';
import { apiFetch, ApiClientError } from '@/lib/api';

export function useDocuments(isAuthenticated: boolean) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchDocuments = useCallback(async () => {
    if (!isAuthenticated) {
      setDocuments([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ documents: DocumentItem[] }>('/api/documents');
      setDocuments(data.documents || []);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to load documents';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;

    apiFetch<{ documents: DocumentItem[] }>('/api/documents')
      .then((data) => {
        if (active) {
          setDocuments(data.documents || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          const msg = err instanceof ApiClientError ? err.message : 'Failed to load documents';
          setError(msg);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const filteredDocuments = useMemo(() => {
    const list = isAuthenticated ? documents : [];
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter((doc) => doc.title.toLowerCase().includes(query));
  }, [isAuthenticated, documents, searchQuery]);

  const createDocument = async (title: string = 'Untitled Document'): Promise<DocumentItem> => {
    try {
      const data = await apiFetch<{ document: DocumentItem }>('/api/documents', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      setDocuments((prev) => [data.document, ...prev]);
      return data.document;
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to create document';
      setError(msg);
      throw err;
    }
  };

  const updateDocumentTitle = async (id: string, title: string): Promise<DocumentItem> => {
    try {
      const data = await apiFetch<{ document: DocumentItem }>(`/api/documents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, title: data.document.title, updatedAt: data.document.updatedAt } : doc))
      );
      return data.document;
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to rename document';
      setError(msg);
      throw err;
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    try {
      await apiFetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Failed to delete document';
      setError(msg);
      throw err;
    }
  };

  return {
    documents,
    filteredDocuments,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchDocuments,
    createDocument,
    updateDocumentTitle,
    deleteDocument,
  };
}
