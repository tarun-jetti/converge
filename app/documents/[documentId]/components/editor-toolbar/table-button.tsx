"use client";

import React, { useState, useRef, useEffect } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { Table as TableIcon, Columns, Rows, Trash2 } from "lucide-react";

interface TableButtonProps {
  editor: Editor | null;
}

export function TableButton({ editor }: TableButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGrid, setHoveredGrid] = useState({ rows: 3, cols: 3 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isInsideTable = useEditorState({
    editor,
    selector: (ctx) => Boolean(ctx.editor?.isActive("table")),
  }) ?? false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!editor) return null;

  const handleInsertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        title="Table"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-1.5 rounded transition-colors ${
          isInsideTable
            ? "bg-blue-100 text-blue-700 font-semibold"
            : isOpen
            ? "bg-slate-200 text-slate-900"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <TableIcon className="w-4 h-4" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 z-50 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-slate-700"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {!isInsideTable ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Insert Table
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {hoveredGrid.rows} × {hoveredGrid.cols}
                </span>
              </div>

              {/* Grid 5x5 */}
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg mb-2">
                {Array.from({ length: 25 }).map((_, index) => {
                  const r = Math.floor(index / 5) + 1;
                  const c = (index % 5) + 1;
                  const isSelected =
                    r <= hoveredGrid.rows && c <= hoveredGrid.cols;

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredGrid({ rows: r, cols: c })}
                      onClick={() => handleInsertTable(r, c)}
                      className={`h-6 w-full rounded border transition-colors ${
                        isSelected
                          ? "bg-blue-500 border-blue-600"
                          : "bg-white border-slate-200 hover:border-slate-400"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleInsertTable(3, 3)}
                className="w-full text-center py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
              >
                Quick Insert 3 × 3
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">
                Table Options
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Columns className="w-3 h-3" /> Columns
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left"
                  >
                    + Left
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left"
                  >
                    + Right
                  </button>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="w-full px-2 py-1 text-xs text-left text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                >
                  Delete Column
                </button>
              </div>

              <hr className="border-slate-100 my-1" />

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Rows className="w-3 h-3" /> Rows
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left"
                  >
                    + Above
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    className="px-2 py-1 text-xs bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-left"
                  >
                    + Below
                  </button>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="w-full px-2 py-1 text-xs text-left text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                >
                  Delete Row
                </button>
              </div>

              <hr className="border-slate-100 my-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 font-medium rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Table
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}