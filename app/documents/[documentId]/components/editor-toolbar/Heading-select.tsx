"use client";

import React from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { ChevronDown } from "lucide-react";

interface HeadingSelectProps {
  editor: Editor | null;
}

export function HeadingSelect({ editor }: HeadingSelectProps) {
  const currentFormat = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return "paragraph";
      if (ctx.editor.isActive("heading", { level: 1 })) return "h1";
      if (ctx.editor.isActive("heading", { level: 2 })) return "h2";
      if (ctx.editor.isActive("heading", { level: 3 })) return "h3";
      return "paragraph";
    },
  }) ?? "paragraph";

  if (!editor) return null;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else if (value === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentFormat}
        onChange={handleSelect}
        onMouseDown={(e) => e.stopPropagation()}
        className="appearance-none bg-transparent hover:bg-slate-100 text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded border border-slate-200 outline-none cursor-pointer transition-colors"
      >
        <option value="paragraph">Normal Text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
    </div>
  );
}