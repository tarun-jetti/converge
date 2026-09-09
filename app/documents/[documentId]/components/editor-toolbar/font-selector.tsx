"use client";

import React from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { ChevronDown } from "lucide-react";

interface FontSelectorsProps {
  editor: Editor | null;
}

const FONT_FAMILIES = [
  { label: "Default Sans", value: "Inter, sans-serif" },
  { label: "Serif", value: "Merriweather, Georgia, serif" },
  { label: "Monospace", value: "JetBrains Mono, monospace" },
  { label: "Comic / Casual", value: "Comic Sans MS, cursive" },
];

const FONT_SIZES = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
];

export function FontSelectors({ editor }: FontSelectorsProps) {
  const currentAttributes = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return { fontFamily: "", fontSize: "" };
      const attrs = ctx.editor.getAttributes("textStyle");
      return {
        fontFamily: attrs.fontFamily || "Inter, sans-serif",
        fontSize: attrs.fontSize || "16px",
      };
    },
  });
  // app/documents/[documentId]/components/editor-toolbar/font-selector.tsx



  if (!editor) return null;
  // app/documents/[documentId]/components/editor-toolbar/font-selector.tsx

const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const val = e.target.value;
  if (val) {
    // Sets font-size via textStyle directly
    editor.chain().focus().setMark("textStyle", { fontSize: val }).run();
  } else {
    // Clears font-size
    editor.chain().focus().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
  }
};

  return (
    <div className="flex items-center gap-1.5">
      {/* Font Family Dropdown */}
      <div className="relative inline-flex items-center">
        <select
          value={currentAttributes?.fontFamily}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editor.chain().focus().setFontFamily(val).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="appearance-none bg-transparent hover:bg-slate-100 text-xs font-medium text-slate-700 py-1 pl-2 pr-6 rounded border border-slate-200 outline-none cursor-pointer transition-colors max-w-[130px] truncate"
          title="Font Family"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
      </div>

      {/* Font Size Dropdown */}
      <div className="relative inline-flex items-center">
        <select
          value={currentAttributes?.fontSize}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              editor.chain().focus().setFontSize(val).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          className="appearance-none bg-transparent hover:bg-slate-100 text-xs font-medium text-slate-700 py-1 pl-2 pr-6 rounded border border-slate-200 outline-none cursor-pointer transition-colors w-[75px]"
          title="Font Size"
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
      </div>
    </div>
  );
}