'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { FontSize as FontSizeExtension } from '../../extentions/font-size';

// Modular Components
import { DocumentHeader } from './components/header/document-header';
import { EditorToolbar } from './components/toolbar/editor-toolbar';
import { EditorBubbleMenu } from './components/bubble-menu/editor-bubble-menu';
import { SlashMenu } from './components/slash-command/slash-menu';
import { TableFloatingBar } from './components/table-actions/table-floating-bar';
import { EditorSidebar } from './components/sidebar/editor-sidebar';
import { EditorCanvas } from './components/canvas/editor-canvas';
import { EditorFooter } from './components/footer/editor-footer';

// Modals
import { ExportModal } from './components/modals/export-modal';
import { ShareModal } from './components/modals/share-modal';
import { TemplatePickerModal } from './components/modals/template-picker-modal';
import { ProfileModal } from './components/modals/profile-modal';

// Hooks & Types
import { useEditorEvents } from './hooks/use-editor-events';
import { useDocumentStorage } from './hooks/use-document-storage';
import { UserProfile, RemoteCursor, ConnectionStatus, PageLayoutMode } from './types';
import { getTemplateById, DocTemplate } from '../templates';

export type { UserProfile, RemoteCursor, ConnectionStatus, PageLayoutMode } from './types';

interface DocumentEditorProps {
  documentId?: string;
  initialTemplateId?: string;
}

export default function DocumentEditor({
  documentId = 'default-doc',
  initialTemplateId,
}: DocumentEditorProps) {
  // Resolve initial template if provided in URL
  const initialTemplate = useMemo(() => {
    return initialTemplateId ? getTemplateById(initialTemplateId) : undefined;
  }, [initialTemplateId]);

  // Document UI State
  const [documentTitle, setDocumentTitle] = useState(
    initialTemplate ? initialTemplate.defaultTitle : 'Project Roadmap & Scope'
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [layoutMode, setLayoutMode] = useState<PageLayoutMode>('canvas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Collaborator presence state (ready for WebSocket/WebRTC)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-me',
    name: 'Alex',
    avatarText: 'AL',
    color: '#6366f1',
    role: 'owner',
  });

  const [remotePeers, setRemotePeers] = useState<UserProfile[]>([
    { id: 'peer-1', name: 'Tarun', avatarText: 'SJ', color: '#f43f5e', role: 'editor' },
    { id: 'peer-2', name: 'kumar', avatarText: 'MC', color: '#10b981', role: 'editor' },
  ]);

  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([
    {
      id: 'peer-1',
      name: 'Tarun',
      color: '#f43f5e',
      x: 32,
      y: 175,
      activeText: 'Reviewing milestones...',
      lastUpdated: Date.now(),
    },
    {
      id: 'peer-2',
      name: 'kumar',
      color: '#10b981',
      x: 62,
      y: 290,
      activeText: 'Adding architecture RFC',
      lastUpdated: Date.now(),
    },
  ]);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [simulatedLatency, setSimulatedLatency] = useState(14);

  // Initial document content
  const startingContent = useMemo(() => {
    if (typeof window !== 'undefined' && documentId) {
      const saved = localStorage.getItem(`converge_doc_${documentId}`);
      if (saved && saved.trim()) return saved;
    }
    if (initialTemplate) return initialTemplate.content;
    return `
      <h1>Project Roadmap & Scope</h1>
      <p>This document serves as the design specification for our next-generation collaborative workspace.</p>
      <h2>Core Principles</h2>
      <p>Every keystroke synchronizes deterministically across connected peers with sub-millisecond latency.</p>
      <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
      <h2>Implementation Milestones</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true">Local CRDT memory buffer</li>
        <li data-type="taskItem" data-checked="true">Real-time collaborative cursor presence</li>
        <li data-type="taskItem" data-checked="false">WebRTC peer mesh discovery</li>
      </ul>
    `;
  }, [documentId, initialTemplate]);

  // TipTap Instance
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write something brilliant, or type "/" for commands...',
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: 'tiptap-table border-collapse border border-slate-300 w-full my-4 table-fixed',
          style: 'border-collapse: collapse; border: 1px solid #cbd5e1; width: 100%; table-layout: fixed; margin: 1.25rem 0;',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-slate-300',
          style: 'border-bottom: 1px solid #cbd5e1;',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-3 min-w-[100px] bg-slate-100 font-semibold text-left text-slate-900',
          style: 'border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 100px; background-color: #f1f5f9; font-weight: 600; text-align: left; color: #0f172a;',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-3 min-w-[100px] align-top text-slate-800',
          style: 'border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 100px; vertical-align: top;',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-6 border border-slate-200/80 shadow-md mx-auto transition-transform hover:scale-[1.01]',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'tiptap-task-list not-prose my-3 space-y-1.5',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'tiptap-task-item flex items-start gap-2.5 leading-normal',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline underline-offset-2 hover:text-indigo-800 cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      FontFamily,
      FontSizeExtension,
    ],
    content: startingContent,
    editorProps: {
      attributes: {
        class:
          'tiptap-content focus:outline-none min-h-[950px] text-slate-800 leading-relaxed font-normal selection:bg-indigo-500/15 selection:text-indigo-900',
      },
    },
  });

  // Reactive Event Hook (selection, transactions)
  const { canUndo, canRedo, activeState, currentFont, currentFontSize } = useEditorEvents(editor);

  // LocalStorage Auto-save Hook
  const { saveStatus } = useDocumentStorage(documentId, editor);

  // Template insertion handler
  const handleApplyTemplate = useCallback(
    (template: DocTemplate, mode: 'replace' | 'append') => {
      if (!editor) return;
      if (mode === 'replace') {
        editor.commands.setContent(template.content);
        setDocumentTitle(template.defaultTitle);
      } else {
        editor.commands.insertContent(template.content);
      }
    },
    [editor]
  );

  return (
    <div className={`min-h-screen bg-[#fafbfc] flex flex-col antialiased text-slate-800 ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : ''}`}>
      {/* 1. TOP MODULAR HEADER */}
      <DocumentHeader
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        saveStatus={saveStatus}
        onOpenTemplates={() => setShowTemplateModal(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        layoutMode={layoutMode}
        onLayoutModeChange={setLayoutMode}
        onOpenExport={() => setShowExportModal(true)}
        onOpenShare={() => setShowShareModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        currentUser={currentUser}
        remotePeers={remotePeers}
        connectionStatus={connectionStatus}
        simulatedLatency={simulatedLatency}
      />

      {/* 2. FLOATING ISLAND TOOLBAR */}
      <EditorToolbar
        editor={editor}
        canUndo={canUndo}
        canRedo={canRedo}
        activeState={activeState}
        currentFont={currentFont}
        currentFontSize={currentFontSize}
      />

      {/* 3. CONTEXTUAL SELECTION BUBBLE MENU */}
      <EditorBubbleMenu editor={editor} activeState={activeState} />

      {/* 4. INTERACTIVE SLASH COMMANDS PALETTE */}
      <SlashMenu editor={editor} />

      {/* 5. CONTEXTUAL TABLE FLOATING ACTION BAR */}
      <TableFloatingBar editor={editor} isInsideTable={activeState.isTable} />

      {/* 6. COLLAPSIBLE LEFT SIDEBAR (Outline, Stats, Templates) */}
      <EditorSidebar
        editor={editor}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* 7. MAIN CANVAS CONTAINER & REAL-TIME CURSORS */}
      <EditorCanvas
        editor={editor}
        remoteCursors={remoteCursors}
        zoomLevel={zoomLevel}
        layoutMode={layoutMode}
      />

      {/* 8. BOTTOM STATUS BAR */}
      <EditorFooter
        editor={editor}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      {/* 9. MODALS & DIALOGS */}
      <TemplatePickerModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        editor={editor}
        onSelectTemplate={handleApplyTemplate}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        editor={editor}
        documentTitle={documentTitle}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentTitle={documentTitle}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => setCurrentUser((u) => ({ ...u, ...updated }))}
      />
    </div>
  );
}
