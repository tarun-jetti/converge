'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Unlink,
  Palette,
  Highlighter,
  RemoveFormatting,
} from 'lucide-react';
import { ActiveEditorState } from '../../types';

interface EditorBubbleMenuProps {
  editor: Editor | null;
  activeState: ActiveEditorState;
}

export function EditorBubbleMenu({ editor, activeState }: EditorBubbleMenuProps) {
  const [showColor, setShowColor] = useState(false);

  if (!editor) return null;

  const handleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter hyperlink URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded-md transition-all duration-100 flex items-center justify-center ${
      isActive
        ? 'bg-slate-900 text-white shadow-2xs'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-xl p-1 z-40 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(activeState.isBold)}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(activeState.isItalic)}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(activeState.isUnderline)}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(activeState.isStrike)}
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(activeState.isCode)}
        title="Inline Code"
      >
        <Code className="w-3.5 h-3.5" />
      </button>

      <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

      {/* Hyperlink */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleLink}
        className={btnClass(activeState.isLink)}
        title={activeState.isLink ? 'Remove Link' : 'Add Link (Ctrl+K)'}
      >
        {activeState.isLink ? <Unlink className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
      </button>

      {/* Quick Highlight */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => (editor.chain().focus() as any).toggleHighlight({ color: '#fef08a' }).run()}
        className={btnClass(editor.isActive('highlight'))}
        title="Highlight Yellow"
      >
        <Highlighter className="w-3.5 h-3.5 text-amber-500" />
      </button>

      {/* Clear Formatting */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className={btnClass(false)}
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </BubbleMenu>
  );
}
