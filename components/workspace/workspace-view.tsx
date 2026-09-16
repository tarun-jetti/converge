'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useDocuments } from '@/hooks/use-documents';
import { DocumentItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

import {
  FileText,
  Plus,
  Search,
  LogOut,
  Sparkles,
  Trash2,
  Edit2,
  ExternalLink,
  MoreVertical,
  Check,
  Copy,
  Loader2,
  FileCode2,
  Users2,
  Compass,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TEMPLATES = [
  { id: 'blank', title: 'Blank Document', subtitle: 'Start fresh', defaultTitle: 'Untitled Document', icon: Plus },
  { id: 'software-rfc', title: 'Architecture RFC', subtitle: 'System design spec', defaultTitle: 'RFC: System Architecture Spec', icon: FileCode2 },
  { id: 'meeting-notes', title: 'Meeting Notes', subtitle: 'Agenda & action items', defaultTitle: 'Weekly Engineering Sync & Roadmap Review', icon: Users2 },
  { id: 'weekly-report', title: 'Weekly Report', subtitle: 'Sprint & health status', defaultTitle: 'Weekly Project Status Report — Sprint 42', icon: Compass },
  { id: 'resume', title: 'Developer Resume', subtitle: 'ATS-ready resume', defaultTitle: 'Alex Rivera — Senior Software Engineer Resume', icon: Briefcase },
];

export function WorkspaceView() {
  const router = useRouter();
  const { user, isAuthenticated, login, register, demoLogin, logout } = useAuth();
  const {
    documents,
    isLoading: isDocsLoading,
    error: docsError,
    fetchDocuments,
    createDocument,
    updateDocumentTitle,
    deleteDocument,
  } = useDocuments(isAuthenticated);

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Rename & Delete state
  const [renameDoc, setRenameDoc] = useState<DocumentItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter((doc) => doc.title.toLowerCase().includes(q));
  }, [documents, searchQuery]);

  // Create doc handler
  const handleCreate = async (title: string = 'Untitled Document', templateId?: string) => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setIsCreating(true);
    try {
      const doc = await createDocument(title);
      const query = templateId ? `?template=${templateId}` : '';
      router.push(`/documents/${doc.id}${query}`);
    } catch (err) {
      console.error('Failed to create document:', err);
      setIsCreating(false);
    }
  };

  // Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      setAuthOpen(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setAuthError(null);
    setIsAuthSubmitting(true);
    try {
      await demoLogin();
      setAuthOpen(false);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameDoc || !newTitle.trim()) return;
    try {
      await updateDocumentTitle(renameDoc.id, newTitle.trim());
      setRenameDoc(null);
    } catch (err) {
      console.error('Failed to rename:', err);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteDoc) return;
    try {
      await deleteDocument(deleteDoc.id);
      setDeleteDoc(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/documents/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 selection:bg-indigo-500/15 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Navbar — Matches DocumentHeader styling exactly */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 select-none shadow-2xs">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition font-semibold text-xs shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
              C
            </div>
            <span className="font-bold tracking-tight text-slate-900">Converge</span>
          </Link>
          <span className="text-slate-300 font-light">&bull;</span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Workspace</span>
        </div>

        {/* Middle: Search bar */}
        {isAuthenticated && (
          <div className="flex-1 max-w-sm mx-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-8 pr-3 h-8 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>
        )}

        {/* Right Auth / Profile */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="max-w-[140px] truncate">{user?.name || user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:text-slate-900"
                title="Sign out"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setAuthError(null);
                setAuthOpen(true);
              }}
              className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* If Guest: Simple Welcome Card */}
        {!isAuthenticated && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700">
                <Sparkles className="size-3" /> Real-time Collaborative Canvas
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome to Converge
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Create documents, invite teammates, and collaborate with zero merge conflicts. Powered by CRDTs and live WebSockets.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <Button
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setAuthOpen(true);
                }}
                className="w-full sm:w-auto h-9 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
              >
                Sign In / Register
              </Button>
              <Button
                variant="outline"
                onClick={handleDemoClick}
                disabled={isAuthSubmitting}
                className="w-full sm:w-auto h-9 text-xs font-medium border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg gap-1.5"
              >
                <Sparkles className="size-3.5 text-indigo-600" />
                <span>1-Click Demo (Tarun)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Template Quick Start */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Start a new document
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  disabled={isCreating}
                  onClick={() => handleCreate(tpl.defaultTitle, tpl.id)}
                  className="group text-left p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between h-28 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {tpl.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {tpl.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Documents Section */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Recent documents</h3>
              {isAuthenticated && (
                <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/70 text-slate-600">
                  {filteredDocuments.length}
                </span>
              )}
            </div>

            <Button
              onClick={() => handleCreate()}
              disabled={isCreating}
              size="sm"
              className="h-8 gap-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              {isCreating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              <span>New Document</span>
            </Button>
          </div>

          {/* Error Banner */}
          {docsError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{docsError}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDocuments}
                className="h-7 text-xs border-rose-300 text-rose-800"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Documents Grid / List */}
          {isDocsLoading && documents.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-white border border-slate-200/80 p-4 space-y-3 animate-pulse">
                  <div className="size-8 rounded-lg bg-slate-100" />
                  <div className="h-3 w-3/4 bg-slate-100 rounded" />
                  <div className="h-2 w-1/2 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-white/60">
              <FileText className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Sign in to view your workspace</p>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Your collaborative documents will appear here once signed in.</p>
              <Button
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="h-7.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
              >
                Sign In Now
              </Button>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-white/60">
              <FileText className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                {searchQuery ? `No documents matching "${searchQuery}"` : 'No documents in this workspace'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                {searchQuery ? 'Try another search term' : 'Create your first document to get started'}
              </p>
              <Button
                size="sm"
                onClick={() => handleCreate()}
                disabled={isCreating}
                className="h-7.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
              >
                <Plus className="size-3.5 mr-1" /> Blank Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredDocuments.map((doc) => {
                const updatedRelative = (() => {
                  try {
                    return formatDistanceToNow(new Date(doc.updatedAt || doc.createdAt), { addSuffix: true });
                  } catch {
                    return 'recently';
                  }
                })();

                return (
                  <div
                    key={doc.id}
                    className="group relative rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xs transition flex flex-col justify-between p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/documents/${doc.id}`} className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {doc.title || 'Untitled Document'}
                          </p>
                          <p suppressHydrationWarning className="text-[11px] text-slate-400 mt-0.5">
                            {updatedRelative}
                          </p>
                        </div>
                      </Link>

                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition outline-none">
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-1">
                          <DropdownMenuItem
                            onClick={() => router.push(`/documents/${doc.id}`)}
                            className="text-xs cursor-pointer gap-2 py-1.5"
                          >
                            <ExternalLink className="size-3.5 text-slate-500" />
                            <span>Open</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyLink(doc.id)}
                            className="text-xs cursor-pointer gap-2 py-1.5"
                          >
                            {copiedId === doc.id ? (
                              <Check className="size-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="size-3.5 text-slate-500" />
                            )}
                            <span>{copiedId === doc.id ? 'Copied' : 'Copy link'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setRenameDoc(doc);
                              setNewTitle(doc.title);
                            }}
                            className="text-xs cursor-pointer gap-2 py-1.5"
                          >
                            <Edit2 className="size-3.5 text-slate-500" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => setDeleteDoc(doc)}
                            className="text-xs text-rose-600 focus:text-rose-600 cursor-pointer gap-2 py-1.5"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Auth Dialog */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-[380px] p-5 bg-white border border-slate-200 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-1">
            <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs mx-auto mb-1">
              C
            </div>
            <DialogTitle className="text-lg font-bold text-center text-slate-900">
              {authMode === 'login' ? 'Sign in to Converge' : 'Create Account'}
            </DialogTitle>
            <DialogDescription className="text-xs text-center text-slate-500">
              {authMode === 'login' ? 'Access your collaborative documents' : 'Join the real-time workspace'}
            </DialogDescription>
          </DialogHeader>

          {/* Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-1 mt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError(null);
              }}
              className={`flex-1 py-1 text-xs font-semibold rounded-md transition ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError(null);
              }}
              className={`flex-1 py-1 text-xs font-semibold rounded-md transition ${
                authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {authError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs mt-2">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3 mt-2">
            {authMode === 'register' && (
              <div className="space-y-1">
                <Label className="text-xs text-slate-700">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="h-8 text-xs"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs text-slate-700">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-700">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-8 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isAuthSubmitting}
              className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg mt-1"
            >
              {isAuthSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoClick}
            disabled={isAuthSubmitting}
            className="w-full h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg gap-1.5"
          >
            <Sparkles className="size-3 text-indigo-600" />
            <span>1-Click Demo (Tarun)</span>
          </Button>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={Boolean(renameDoc)} onOpenChange={(open) => !open && setRenameDoc(null)}>
        <DialogContent className="sm:max-w-[360px] p-5 bg-white border border-slate-200 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-900">Rename Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit} className="space-y-3 mt-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Document title"
              required
              autoFocus
              className="h-8 text-xs"
            />
            <DialogFooter className="gap-2 sm:gap-0 mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRenameDoc(null)}
                className="h-7.5 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-7.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteDoc)} onOpenChange={(open) => !open && setDeleteDoc(null)}>
        <DialogContent className="sm:max-w-[360px] p-5 bg-white border border-slate-200 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-sm font-bold text-slate-900">Delete document?</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Permanently delete &ldquo;{deleteDoc?.title}&rdquo;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteDoc(null)}
              className="h-7.5 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteSubmit}
              className="h-7.5 text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
