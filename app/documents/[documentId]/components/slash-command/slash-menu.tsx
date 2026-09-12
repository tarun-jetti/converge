'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { SLASH_COMMANDS, SlashCommandItem } from './slash-commands';

interface SlashMenuProps {
  editor: Editor | null;
}

export function SlashMenu({ editor }: SlashMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback(
    (command: SlashCommandItem) => {
      if (!editor) return;

      // Delete the slash and query from editor
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 20), from, '\n');
      const slashIndex = textBefore.lastIndexOf('/');

      if (slashIndex !== -1) {
        const deleteLength = textBefore.length - slashIndex;
        editor.chain().focus().deleteRange({ from: from - deleteLength, to: from }).run();
      }

      command.action(editor);
      closeMenu();
    },
    [editor, closeMenu]
  );

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (view: any, event: KeyboardEvent) => {
      if (event.key === '/') {
        // Position popup near cursor
        setTimeout(() => {
          try {
            const { from } = editor.state.selection;
            const start = view.coordsAtPos(from);
            setCoords({ x: start.left, y: start.bottom + 6 });
            setIsOpen(true);
            setQuery('');
            setSelectedIndex(0);
          } catch {
            setIsOpen(true);
          }
        }, 10);
        return false;
      }

      if (isOpen) {
        if (event.key === 'Escape') {
          closeMenu();
          return true;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
          return true;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev <= 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
          );
          return true;
        }

        if (event.key === 'Enter') {
          event.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          return true;
        }

        if (event.key === 'Backspace') {
          if (query.length === 0) {
            closeMenu();
          } else {
            setQuery((q) => q.slice(0, -1));
          }
          return false;
        }

        // Add character to query if printable
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          setQuery((q) => q + event.key);
        }
      }

      return false;
    };

    editor.setOptions({
      editorProps: {
        handleKeyDown,
      },
    });

    return () => {
      // cleanup
    };
  }, [editor, isOpen, query, selectedIndex, filteredCommands, executeCommand, closeMenu]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);

  if (!isOpen || !editor) return null;

  return (
    <div
      ref={menuRef}
      style={{
        top: `${Math.max(70, coords.y)}px`,
        left: `${Math.max(20, Math.min(window.innerWidth - 320, coords.x))}px`,
      }}
      className="fixed z-50 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl p-1.5 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 select-none print:hidden"
    >
      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
        <span>Insert block</span>
        {query && <span className="text-indigo-600 font-mono">/{query}</span>}
      </div>

      {filteredCommands.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">No matching commands</div>
      ) : (
        <div className="space-y-0.5">
          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={cmd.id}
                type="button"
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => executeCommand(cmd)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200/70 text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold leading-none">{cmd.title}</div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {cmd.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
