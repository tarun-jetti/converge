'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useDocuments } from '@/hooks/use-documents';
import { DocumentItem, TemplateItem } from '@/lib/types';

import { WorkspaceNavbar } from './workspace-navbar';
import { GuestLanding } from './guest-landing';
import { TemplateGallery } from './template-gallery';
import { DocumentControls } from './document-controls';
import { DocumentGrid } from './document-grid';
import { DocumentTable } from './document-table';
import { DocumentEmptyState } from './document-empty-state';
import { AuthDialog } from './auth-dialog';
import { RenameDialog } from './rename-dialog';
import { DeleteDialog } from './delete-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceShell() {
  const router = useRouter();

  // 1. Authentication State
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    register,
    demoLogin,
    logout,
  } = useAuth();

  // 2. Document Collection State
  const {
    documents,
    filteredDocuments,
    isLoading: isDocsLoading,
    error: docsError,
    searchQuery,
    setSearchQuery,
    fetchDocuments,
    createDocument,
    updateDocumentTitle,
    deleteDocument,
  } = useDocuments(isAuthenticated);

  // 3. UI State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [selectedRenameDoc, setSelectedRenameDoc] = useState<DocumentItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedDeleteDoc, setSelectedDeleteDoc] = useState<DocumentItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDemoLoading, setIsDemoLoading] = useState<boolean>(false);

  // 4. Create Document Handlers
  const handleCreateDocument = async (title: string = 'Untitled Document', templateId?: string) => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    setIsCreating(true);
    try {
      const newDoc = await createDocument(title);
      const queryParam = templateId ? `?template=${templateId}` : '';
      router.push(`/documents/${newDoc.id}${queryParam}`);
    } catch (err) {
      console.error('Failed to create document:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    handleCreateDocument(template.defaultTitle, template.id === 'blank' ? undefined : template.id);
  };

  // 5. Rename & Delete Handlers
  const handleOpenRename = (doc: DocumentItem) => {
    setSelectedRenameDoc(doc);
    setRenameDialogOpen(true);
  };

  const handleOpenDelete = (doc: DocumentItem) => {
    setSelectedDeleteDoc(doc);
    setDeleteDialogOpen(true);
  };

  const handleRenameConfirm = async (id: string, newTitle: string) => {
    await updateDocumentTitle(id, newTitle);
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteDocument(id);
  };

  const handleDemoLoginAction = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin();
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <WorkspaceNavbar
        user={user}
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setAuthDialogOpen(true)}
        onLogout={logout}
        onCreateDocument={() => handleCreateDocument()}
        isCreating={isCreating}
      />

      {/* Main Content Area */}
      {isAuthLoading ? (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-44 rounded-xl" />
          </div>
        </div>
      ) : !isAuthenticated ? (
        <GuestLanding
          onOpenAuth={() => setAuthDialogOpen(true)}
          onDemoLogin={handleDemoLoginAction}
          isDemoLoading={isDemoLoading}
        />
      ) : (
        <main className="flex-1 pb-16">
          {/* Quick-Start Templates Gallery */}
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            isCreating={isCreating}
          />

          {/* Document Workspace Body */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <DocumentControls
              totalCount={documents.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onCreateDocument={() => handleCreateDocument()}
              onRefresh={fetchDocuments}
              isCreating={isCreating}
              isLoading={isDocsLoading}
            />

            {/* Error Banner */}
            {docsError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{docsError}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDocuments}
                  className="h-7 text-xs gap-1.5 border-rose-300 dark:border-rose-800"
                >
                  <RefreshCw className="size-3" />
                  Retry
                </Button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isDocsLoading && documents.length === 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                      <Skeleton className="h-20 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                  <Skeleton className="h-10 w-full rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              )
            ) : filteredDocuments.length === 0 ? (
              <DocumentEmptyState
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                onCreateDocument={() => handleCreateDocument()}
                isCreating={isCreating}
              />
            ) : viewMode === 'grid' ? (
              <DocumentGrid
                documents={filteredDocuments}
                currentUserId={user?.id}
                onRename={handleOpenRename}
                onDelete={handleOpenDelete}
              />
            ) : (
              <DocumentTable
                documents={filteredDocuments}
                currentUserId={user?.id}
                onRename={handleOpenRename}
                onDelete={handleOpenDelete}
              />
            )}
          </div>
        </main>
      )}

      {/* Global Modals */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onLogin={login}
        onRegister={register}
        onDemoLogin={demoLogin}
      />

      <RenameDialog
        document={selectedRenameDoc}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        onRename={handleRenameConfirm}
      />

      <DeleteDialog
        document={selectedDeleteDoc}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
