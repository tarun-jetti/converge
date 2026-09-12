'use client';

import { useState, useEffect, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import { ActiveEditorState } from '../types';

export function useEditorEvents(editor: Editor | null) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => setTick((prev) => prev + 1);

    editor.on('transaction', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('update', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  const canUndo = useMemo(() => Boolean(editor?.can().undo()), [editor, tick]);
  const canRedo = useMemo(() => Boolean(editor?.can().redo()), [editor, tick]);

  const activeState: ActiveEditorState = useMemo(() => {
    if (!editor) {
      return {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        isCode: false,
        isLeft: false,
        isCenter: false,
        isRight: false,
        isBullet: false,
        isOrdered: false,
        isTaskList: false,
        isQuote: false,
        isTable: false,
        isLink: false,
      };
    }

    return {
      isBold: Boolean(editor.isActive('bold')),
      isItalic: Boolean(editor.isActive('italic')),
      isUnderline: Boolean(editor.isActive('underline')),
      isStrike: Boolean(editor.isActive('strike')),
      isCode: Boolean(editor.isActive('code')),
      isLeft: Boolean(editor.isActive({ textAlign: 'left' })),
      isCenter: Boolean(editor.isActive({ textAlign: 'center' })),
      isRight: Boolean(editor.isActive({ textAlign: 'right' })),
      isBullet: Boolean(editor.isActive('bulletList')),
      isOrdered: Boolean(editor.isActive('orderedList')),
      isTaskList: Boolean(editor.isActive('taskList')),
      isQuote: Boolean(editor.isActive('blockquote')),
      isTable: Boolean(editor.isActive('table')),
      isLink: Boolean(editor.isActive('link')),
    };
  }, [editor, tick]);

  const currentFont = useMemo(() => {
    if (!editor) return 'Inter, sans-serif';
    return (editor.getAttributes('textStyle')?.fontFamily as string) || 'Inter, sans-serif';
  }, [editor, tick]);

  const currentFontSize = useMemo(() => {
    if (!editor) return '16px';
    const val = editor.getAttributes('textStyle')?.fontSize;
    return val ? String(val) : '16px';
  }, [editor, tick]);

  return {
    tick,
    canUndo,
    canRedo,
    activeState,
    currentFont,
    currentFontSize,
  };
}
