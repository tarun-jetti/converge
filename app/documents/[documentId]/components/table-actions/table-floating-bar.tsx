'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Plus,
  Trash2,
  Table as TableIcon,
  Columns,
  Rows,
  Sparkles,
} from 'lucide-react';

interface TableFloatingBarProps {
  editor: Editor | null;
  isInsideTable: boolean;
}

export function TableFloatingBar({ editor, isInsideTable }: TableFloatingBarProps) {
  if (!editor || !isInsideTable) return null;

  const run = (fn: (chain: any) => any) => {
    try {
      fn(editor.chain().focus()).run();
    } catch (e) {
      console.warn('Table command error:', e);
    }
  };

  const btnClass =
    'p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1 text-xs font-semibold active:scale-95';

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl px-3 py-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-3 duration-150 select-none print:hidden">
      <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 text-indigo-600 font-bold text-xs">
        <TableIcon className="w-3.5 h-3.5" />
        <span>Table</span>
      </div>

      {/* Row operations */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.addRowBefore())}
          className={btnClass}
          title="Add Row Above"
        >
          <Plus className="w-3 h-3 text-emerald-600" />
          <span className="text-[11px]">Row &uarr;</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.addRowAfter())}
          className={btnClass}
          title="Add Row Below"
        >
          <Plus className="w-3 h-3 text-emerald-600" />
          <span className="text-[11px]">Row &darr;</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.deleteRow())}
          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition text-[11px] font-semibold"
          title="Delete Current Row"
        >
          Del Row
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Column operations */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.addColumnBefore())}
          className={btnClass}
          title="Add Column Left"
        >
          <Plus className="w-3 h-3 text-indigo-600" />
          <span className="text-[11px]">Col &larr;</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.addColumnAfter())}
          className={btnClass}
          title="Add Column Right"
        >
          <Plus className="w-3 h-3 text-indigo-600" />
          <span className="text-[11px]">Col &rarr;</span>
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run((c) => c.deleteColumn())}
          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition text-[11px] font-semibold"
          title="Delete Current Column"
        >
          Del Col
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Header & Table Deletion */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => run((c) => c.toggleHeaderRow())}
        className={btnClass}
        title="Toggle Header Row"
      >
        <Rows className="w-3.5 h-3.5" />
        <span className="text-[11px]">Header</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => run((c) => c.deleteTable())}
        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100/80 transition flex items-center gap-1 text-[11px] font-bold ml-1"
        title="Delete Entire Table"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
}
