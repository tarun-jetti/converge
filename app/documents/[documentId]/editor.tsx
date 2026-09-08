"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

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
} from "lucide-react";

export default function DocumentEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type your thoughts or press '/' for commands...",
      }),
    ],
    immediatelyRender: false,
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

  if (!editor) return null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans select-none">
      {/* 1. TOP NAV / HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            D
          </div>
          <div>
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
        </div>

        {/* Presence & Controls */}
        <div className="flex items-center gap-3">
          {/* Collaborator Avatars */}
          <div className="flex -space-x-2 overflow-hidden items-center pr-2 border-r border-slate-200">
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: "#0284c7" }}
              title="Alex (You)"
            >
              AL
            </span>
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: "#e11d48" }}
              title="Sarah Jenkins"
            >
              SJ
            </span>
            <span
              className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: "#16a34a" }}
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
      <section className="h-11 bg-white border-b border-slate-200 px-6 flex items-center gap-1 shrink-0 overflow-x-auto">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* Heading Dropdown / Quick buttons */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive("paragraph")
              ? "bg-slate-200 text-slate-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-slate-200 text-slate-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 text-xs font-medium rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-slate-200 text-slate-900"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          H2
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* Formatting Marks */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${
            editor.isActive("bold")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${
            editor.isActive("italic")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded ${
            editor.isActive("underline")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded ${
            editor.isActive("strike")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded ${
            editor.isActive("code")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1.5" />

        {/* Lists & Callouts */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded ${
            editor.isActive("bulletList")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded ${
            editor.isActive("orderedList")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded ${
            editor.isActive("blockquote")
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </section>

      {/* 3. CONTEXTUAL FLOATING BUBBLE MENU */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-sm text-black px-1.5 py-1 rounded-lg shadow-xl border border-slate-800"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 ${
              editor.isActive("bold") ? "text-blue-400 font-bold" : ""
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 ${
              editor.isActive("italic") ? "text-blue-400 italic" : ""
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded text-xs hover:bg-slate-800 ${
              editor.isActive("underline") ? "text-blue-400" : ""
            }`}
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </BubbleMenu>
      )}

      {/* 4. WORKSPACE CANVAS (Scrollable viewport) */}
      <main className="flex-1 overflow-y-auto px-4 py-8 flex justify-center cursor-text">
        {/* DOCUMENT PAGE SHEET (Standard A4 Proportions: 816px x 1056px) */}
        <div className="w-full max-w-[816px] min-h-[1056px] bg-white border border-slate-200/80 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)] px-16 py-16 transition-shadow hover:shadow-[0_6px_25px_rgba(0,0,0,0.08)]">
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
}