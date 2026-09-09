"use client";

import React from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { ToolbarButton } from "./components/editor-toolbar/toolbar-item";
import { TableButton } from "./components/editor-toolbar/table-button";
import { HeadingSelect } from "./components/editor-toolbar/Heading-select";
import {TextStyle} from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "../../extentions/font-size";
import { FontSelectors } from "./components/editor-toolbar/font-selector";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Share2,
  Download,
  CloudCheck,
  Image as ImageIcon,
} from "lucide-react";

export default function DocumentEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type your thoughts or press '/' for commands...",
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4 border border-slate-200 shadow-sm",
        },
      }),
      TextStyle,
      FontFamily,
      FontSize,
    ],
    content: `
      <h1>Project Roadmap & Scope</h1>
      <p>This document serves as the design specification for our real-time collaborative workspace.</p>
      <h2>Core Principles</h2>
      <p>Every keystroke synchronizes deterministically across connected peers with near-zero latency.</p>
      <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
    `,
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none min-h-[900px] text-slate-800",
      },
    },
  });

  // History states
  const canUndo = useEditorState({
    editor,
    selector: (ctx) => Boolean(ctx.editor?.can().undo()),
  });

  const canRedo = useEditorState({
    editor,
    selector: (ctx) => Boolean(ctx.editor?.can().redo()),
  });

  // Formatting active states (keeps JSX clean)
  const activeState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: Boolean(ctx.editor?.isActive("bold")),
      isItalic: Boolean(ctx.editor?.isActive("italic")),
      isUnderline: Boolean(ctx.editor?.isActive("underline")),
      isStrike: Boolean(ctx.editor?.isActive("strike")),
      isCode: Boolean(ctx.editor?.isActive("code")),
      isLeft: Boolean(ctx.editor?.isActive({ textAlign: "left" })),
      isCenter: Boolean(ctx.editor?.isActive({ textAlign: "center" })),
      isRight: Boolean(ctx.editor?.isActive({ textAlign: "right" })),
      isBullet: Boolean(ctx.editor?.isActive("bulletList")),
      isOrdered: Boolean(ctx.editor?.isActive("orderedList")),
      isQuote: Boolean(ctx.editor?.isActive("blockquote")),
      isImage: Boolean(ctx.editor?.isActive("image")),
    }),
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP NAV / HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            D
          </div>
          <div className="flex items-center gap-2">
            <input
              defaultValue="Untitled Document"
              className="font-semibold text-slate-800 text-sm hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1.5 py-0.5 outline-none transition"
            />
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CloudCheck className="w-3.5 h-3.5" /> Saved
            </span>
          </div>
        </div>

        {/* Presence & Controls */}
        <div className="flex items-center gap-3">
          {/* Static Collaborator Avatars (Pre-CRDT) */}
          <div className="flex -space-x-2 overflow-hidden items-center pr-2 border-r border-slate-200">
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm bg-sky-600"
              title="Alex (You)"
            >
              AL
            </span>
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm bg-rose-600"
              title="Sarah Jenkins"
            >
              SJ
            </span>
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm bg-emerald-600"
              title="Marcus Chen"
            >
              MC
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </header>

      {/* 2. PERSISTENT TOOLBAR */}
      <section className="h-11 bg-white border-b border-slate-200 px-6 flex items-center gap-1 shrink-0 z-30">        
        <FontSelectors editor={editor} />
        <ToolbarButton
        icon={Undo}
        disabled={!canUndo}
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      />
        <ToolbarButton
          icon={Redo}
          disabled={!canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        />

        <div className="w-px h-5 bg-slate-200 mx-1.5" />
        <HeadingSelect editor={editor} />
        <ToolbarButton
          icon={Bold}
          isActive={activeState?.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        />
        <ToolbarButton
          icon={Italic}
          isActive={activeState?.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          isActive={activeState?.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        />
        <ToolbarButton
          icon={Strikethrough}
          isActive={activeState?.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        />
        <ToolbarButton
          icon={Code}
          isActive={activeState?.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        />

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <ToolbarButton
          icon={AlignLeft}
          isActive={activeState?.isLeft}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        />
        <ToolbarButton
          icon={AlignCenter}
          isActive={activeState?.isCenter}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        />
        <ToolbarButton
          icon={AlignRight}
          isActive={activeState?.isRight}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        />

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <ToolbarButton
          icon={List}
          isActive={activeState?.isBullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={activeState?.isOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        />
        <ToolbarButton
          icon={Quote}
          isActive={activeState?.isQuote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        />

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* Self-contained Table Menu Popover */}
        <TableButton editor={editor} />

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt("Enter image URL");
            if (url) {
              editor.chain().focus().setImage({ src: url.trim() }).run();
            }
          }}
          className={`p-1.5 rounded transition-colors ${activeState?.isImage
            ? "bg-blue-100 text-blue-700"
            : "text-slate-600 hover:bg-slate-100"
            }`}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </section>

      {/* 3. FLOATING BUBBLE MENU */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-sm text-slate-200 px-1.5 py-1 rounded-lg shadow-xl border border-slate-800"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 transition ${activeState?.isBold ? "text-blue-400 font-bold" : ""
              }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 transition ${activeState?.isItalic ? "text-blue-400 italic" : ""
              }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 transition ${activeState?.isUnderline ? "text-blue-400" : ""
              }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </BubbleMenu>
      )}

      {/* 4. MAIN EDITOR CANVAS (Page View) */}
      <main className="flex-1 overflow-auto flex justify-center p-8">
        <div className="w-full max-w-4xl min-h-[900px] bg-white border border-slate-200 rounded-lg shadow-sm p-12 cursor-text">
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
}