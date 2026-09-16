'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  LogOut,
  Layers,
  FileText,
} from 'lucide-react';

interface WorkspaceNavbarProps {
  user: User | null;
  isAuthenticated: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onCreateDocument: () => void;
  isCreating?: boolean;
}

export function WorkspaceNavbar({
  user,
  isAuthenticated,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  onLogout,
  onCreateDocument,
  isCreating = false,
}: WorkspaceNavbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Converge
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium tracking-wide uppercase mt-0.5">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Shown when authenticated) */}
        {isAuthenticated && (
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search documents... (Press '/' to focus)"
                className="w-full pl-9 pr-8 h-9 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus-visible:bg-white dark:focus-visible:bg-slate-950 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <Button
                onClick={onCreateDocument}
                disabled={isCreating}
                size="sm"
                className="h-8 gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">New Document</span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <div className="size-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-white dark:ring-slate-900 hover:opacity-90 transition">
                    {userInitial}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5">
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Converge Member'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={onCreateDocument}
                    className="gap-2 text-xs cursor-pointer py-1.5"
                  >
                    <FileText className="size-3.5 text-slate-500" />
                    <span>Create Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="gap-2 text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer py-1.5"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAuth}
                className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={onOpenAuth}
                className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
