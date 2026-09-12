import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code2,
  Table as TableIcon,
  Minus,
  ImageIcon,
  LucideIcon,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { DocTemplate } from '../../../templates';

export interface SlashCommandItem {
  id: string;
  title: string;
  description: string;
  category: 'Basic' | 'Lists' | 'Blocks' | 'Templates';
  icon: LucideIcon;
  action: (editor: Editor) => void;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    id: 'text',
    title: 'Text',
    description: 'Start writing plain text.',
    category: 'Basic',
    icon: Type,
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: 'h1',
    title: 'Heading 1',
    description: 'Large section heading.',
    category: 'Basic',
    icon: Heading1,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'h2',
    title: 'Heading 2',
    description: 'Medium sub-heading.',
    category: 'Basic',
    icon: Heading2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'h3',
    title: 'Heading 3',
    description: 'Small subsection heading.',
    category: 'Basic',
    icon: Heading3,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    id: 'bullet-list',
    title: 'Bullet List',
    description: 'Create a standard unordered list.',
    category: 'Lists',
    icon: List,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'numbered-list',
    title: 'Numbered List',
    description: 'Create an ordered sequence.',
    category: 'Lists',
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'task-list',
    title: 'Task Checklist',
    description: 'Track to-dos with interactive checkboxes.',
    category: 'Lists',
    icon: ListTodo,
    action: (editor) => (editor.chain().focus() as any).toggleTaskList().run(),
  },
  {
    id: 'table',
    title: 'Table',
    description: 'Insert a 3x3 data matrix table.',
    category: 'Blocks',
    icon: TableIcon,
    action: (editor) => {
      try {
        (editor.chain().focus() as any).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      } catch {
        editor.chain().focus().insertContent('<table><tbody><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>').run();
      }
    },
  },
  {
    id: 'code-block',
    title: 'Code Block',
    description: 'Preformatted monospace code snippet.',
    category: 'Blocks',
    icon: Code2,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'blockquote',
    title: 'Quote',
    description: 'Highlighted quotation or callout.',
    category: 'Blocks',
    icon: Quote,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Visually separate document sections.',
    category: 'Blocks',
    icon: Minus,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    id: 'image',
    title: 'Image URL',
    description: 'Embed an image from a web address.',
    category: 'Blocks',
    icon: ImageIcon,
    action: (editor) => {
      const url = window.prompt('Enter image URL:', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    },
  },
];
