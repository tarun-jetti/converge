'use client';

import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { RemoteCursors } from './remote-cursors';
import { RemoteCursor, PageLayoutMode } from '../../types';

interface EditorCanvasProps {
  editor: Editor | null;
  remoteCursors: RemoteCursor[];
  zoomLevel: number;
  layoutMode: PageLayoutMode;
  leftMargin?: number;
  rightMargin?: number;
}

export function EditorCanvas({
  editor,
  remoteCursors,
  zoomLevel,
  layoutMode,
  leftMargin = 56,
  rightMargin = 56,
}: EditorCanvasProps) {
  // Compute container width and styling based on layout mode
  const getMaxWidthClass = () => {
    switch (layoutMode) {
      case 'wide':
        return 'max-w-5xl';
      case 'paginated':
        return 'max-w-[816px]';
      case 'canvas':
      default:
        return 'max-w-[850px]';
    }
  };

  const getContainerStyle = () => {
    if (layoutMode === 'paginated') {
      return 'bg-white rounded-md border border-slate-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] px-14 py-16 min-h-[1056px] print:border-none print:shadow-none print:p-0';
    }
    return 'bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] px-12 sm:px-16 py-14 min-h-[1050px]';
  };

  return (
    <main className="flex-1 flex justify-center py-6 px-4 sm:px-6 overflow-y-auto">
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
        }}
        className={`relative w-full ${getMaxWidthClass()} ${getContainerStyle()} transition-all duration-150`}
      >
        {/* Real-time collaborator cursors */}
        <RemoteCursors cursors={remoteCursors} />

        {/* TipTap Document Body */}
        <div
          style={{
            paddingLeft: `${Math.max(0, leftMargin - 48)}px`,
            paddingRight: `${Math.max(0, rightMargin - 48)}px`,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </main>
  );
}
