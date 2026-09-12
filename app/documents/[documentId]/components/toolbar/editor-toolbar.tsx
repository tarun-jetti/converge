'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Undo2,
  Redo2,
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
  ListTodo,
  Quote,
  Minus,
  Image as ImageIcon,
  RemoveFormatting,
  Code2,
} from 'lucide-react';
import { FontFamilySelect } from './font-family-select';
import { FontSizeSelect } from './font-size-select';
import { HeadingSelect } from './heading-select';
import { ColorPickerPopover } from './color-picker-popover';
import { TableGridPopover } from './table-grid-popover';
import { ActiveEditorState } from '../../types';

interface EditorToolbarProps {
  editor: Editor | null;
  canUndo: boolean;
  canRedo: boolean;
  activeState: ActiveEditorState;
  currentFont: string;
  currentFontSize: string;
}

export function EditorToolbar({
  editor,
  canUndo,
  canRedo,
  activeState,
  currentFont,
  currentFontSize,
}: EditorToolbarProps) {
  if (!editor) return null;

  const insertImage = () => {
    const url = window.prompt(
      'Enter image URL:',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const btnClass = (isActive: boolean, disabled?: boolean) =>
    `p-1.5 rounded-lg transition-all duration-100 flex items-center justify-center ${
      isActive
        ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900 scale-[1.02]'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`;

  return (
    <div className="relative z-30 pt-3 pb-2 px-4 flex justify-center shrink-0 print:hidden">
      <section className="bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)] rounded-2xl px-2.5 py-1.5 flex items-center gap-1 overflow-x-auto max-w-5xl transition-all">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            disabled={!canUndo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            className={btnClass(false, !canUndo)}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            className={btnClass(false, !canRedo)}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Typography & Size Selectors */}
        <FontFamilySelect editor={editor} currentFont={currentFont} />
        <FontSizeSelect editor={editor} currentSize={currentFontSize} />
        <HeadingSelect editor={editor} />

        <div className="h-4 w-px bg-slate-200" />

        {/* Inline Marks */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={btnClass(activeState.isBold)}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={btnClass(activeState.isItalic)}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={btnClass(activeState.isUnderline)}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={btnClass(activeState.isStrike)}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={btnClass(activeState.isCode)}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Colors */}
        <ColorPickerPopover editor={editor} />

        <div className="h-4 w-px bg-slate-200" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={btnClass(activeState.isLeft)}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={btnClass(activeState.isCenter)}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={btnClass(activeState.isRight)}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Lists & Tasks */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btnClass(activeState.isBullet)}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btnClass(activeState.isOrdered)}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (editor.chain().focus() as any).toggleTaskList().run()}
            className={btnClass(activeState.isTaskList)}
            title="Task Checklist"
          >
            <ListTodo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Blocks, Table & Media */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={btnClass(activeState.isQuote)}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={btnClass(editor.isActive('codeBlock'))}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={btnClass(false)}
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>

          <TableGridPopover editor={editor} isInsideTable={activeState.isTable} />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertImage}
            className={btnClass(false)}
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className={btnClass(false)}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
