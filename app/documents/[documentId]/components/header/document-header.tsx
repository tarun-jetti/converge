'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Share2,
  Download,
  Check,
  PanelLeft,
} from 'lucide-react';
import { PresenceBar } from './presence-bar';
import { UserProfile, ConnectionStatus, PageLayoutMode } from '../../types';

interface DocumentHeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
  saveStatus: 'saved' | 'saving' | 'idle';
  onOpenTemplates: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  layoutMode: PageLayoutMode;
  onLayoutModeChange: (mode: PageLayoutMode) => void;
  onOpenExport: () => void;
  onOpenShare: () => void;
  onOpenProfile: () => void;
  currentUser: UserProfile;
  remotePeers: UserProfile[];
  connectionStatus: ConnectionStatus;
  simulatedLatency: number;
}

export function DocumentHeader({
  documentTitle,
  onTitleChange,
  saveStatus,
  onOpenTemplates,
  onToggleSidebar,
  isSidebarOpen,
  layoutMode,
  onLayoutModeChange,
  onOpenExport,
  onOpenShare,
  onOpenProfile,
  currentUser,
  remotePeers,
  connectionStatus,
  simulatedLatency,
}: DocumentHeaderProps) {
  const [localTitle, setLocalTitle] = useState(documentTitle);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalTitle(documentTitle);
  }, [documentTitle]);

  const commitTitle = () => {
    setIsEditing(false);
    if (localTitle.trim() && localTitle !== documentTitle) {
      onTitleChange(localTitle.trim());
    } else {
      setLocalTitle(documentTitle);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between gap-3 select-none print:hidden shadow-2xs">
      {/* Left Group: Home link, Sidebar toggle and Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition font-semibold text-xs shrink-0"
          title="Return to Home Workspace"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
            C
          </div>
          <span className="hidden sm:inline font-bold tracking-tight text-slate-900">Converge</span>
        </Link>

        <span className="text-slate-300 font-light">&bull;</span>

        <button
          type="button"
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-xl transition flex items-center gap-1 text-xs font-semibold ${
            isSidebarOpen
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Toggle Outline and Tools Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
          <span className="hidden md:inline">Outline</span>
        </button>

        <span className="text-slate-300 font-light hidden sm:inline">/</span>

        {/* Editable Title */}
        <div className="flex items-center min-w-0 max-w-xs md:max-w-md">
          {isEditing ? (
            <input
              type="text"
              value={localTitle}
              autoFocus
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') {
                  setLocalTitle(documentTitle);
                  setIsEditing(false);
                }
              }}
              className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 outline-none ring-2 ring-indigo-500/20 w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-slate-900 hover:bg-slate-100 rounded-lg px-2 py-1 text-left truncate transition max-w-full"
              title="Click to rename document"
            >
              {documentTitle}
            </button>
          )}
        </div>

        {/* Save Status Badge */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/60 shrink-0">
          {saveStatus === 'saving' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-slate-500">Saved locally</span>
            </>
          )}
        </div>
      </div>

      {/* Right Group: Layout Mode, Templates, Presence and Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Layout Mode Selector */}
        <div className="hidden xl:flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200/80 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onLayoutModeChange('canvas')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layoutMode === 'canvas'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
            title="Continuous canvas view"
          >
            Canvas
          </button>
          <button
            type="button"
            onClick={() => onLayoutModeChange('paginated')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layoutMode === 'paginated'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
            title="Paginated A4 page view"
          >
            Page
          </button>
          <button
            type="button"
            onClick={() => onLayoutModeChange('wide')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layoutMode === 'wide'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
            title="Full-width expanded view"
          >
            Wide
          </button>
        </div>

        {/* Templates Picker Trigger */}
        <button
          type="button"
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 transition active:scale-95 shadow-2xs"
          title="Browse and insert templates"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Live Collaborators Presence */}
        <PresenceBar
          currentUser={currentUser}
          remotePeers={remotePeers}
          connectionStatus={connectionStatus}
          simulatedLatency={simulatedLatency}
          onOpenProfile={onOpenProfile}
        />

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Export Button */}
        <button
          type="button"
          onClick={onOpenExport}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95"
          title="Export as PDF, Markdown, or HTML"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 transition active:scale-95 shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}
