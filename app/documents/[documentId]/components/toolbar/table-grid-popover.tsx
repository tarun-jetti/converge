'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Table as TableIcon } from 'lucide-react';

interface TableGridPopoverProps {
  editor: Editor | null;
  isInsideTable: boolean;
}

const MAX_ROWS = 6;
const MAX_COLS = 6;

export function TableGridPopover({ editor, isInsideTable }: TableGridPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGrid, setHoveredGrid] = useState({ rows: 3, cols: 3 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!editor) return null;

  const insertTable = (rows: number, cols: number) => {
    setIsOpen(false);
    try {
      (editor.chain().focus() as any)
        .insertTable({ rows, cols, withHeaderRow: true })
        .run();
    } catch {
      let html = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #cbd5e1; margin: 1.25rem 0;"><tbody>';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
          if (r === 0) {
            html += `<th style="border: 1px solid #cbd5e1; padding: 10px 14px; background-color: #f1f5f9; font-weight: 600; min-width: 100px; text-align: left;">Header ${c + 1}</th>`;
          } else {
            html += `<td style="border: 1px solid #cbd5e1; padding: 10px 14px; min-width: 100px; vertical-align: top;"><p>Cell ${r},${c + 1}</p></td>`;
          }
        }
        html += '</tr>';
      }
      html += '</tbody></table><p></p>';
      editor.chain().focus().insertContent(html).run();
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg transition-all duration-150 ${
          isInsideTable
            ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200'
            : isOpen
            ? 'bg-slate-900 text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Insert Table"
      >
        <TableIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 select-none">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="text-[11px] font-bold text-slate-700">Insert Table</span>
            <span className="text-[11px] font-mono font-semibold text-indigo-600">
              {hoveredGrid.cols} &times; {hoveredGrid.rows}
            </span>
          </div>

          <div
            className="grid gap-1 p-1 bg-slate-50/80 rounded-xl border border-slate-100"
            style={{ gridTemplateColumns: `repeat(${MAX_COLS}, minmax(0, 1fr))` }}
            onMouseLeave={() => setHoveredGrid({ rows: 3, cols: 3 })}
          >
            {Array.from({ length: MAX_ROWS }).map((_, r) =>
              Array.from({ length: MAX_COLS }).map((_, c) => {
                const isSelected = r < hoveredGrid.rows && c < hoveredGrid.cols;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onMouseEnter={() => setHoveredGrid({ rows: r + 1, cols: c + 1 })}
                    onClick={() => insertTable(r + 1, c + 1)}
                    className={`w-6 h-6 rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-indigo-500 border-indigo-600 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
