'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Download,
  FileText,
  FileCode,
  Printer,
  X,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  documentTitle: string;
}

export function ExportModal({
  isOpen,
  onClose,
  editor,
  documentTitle,
}: ExportModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen || !editor) return null;

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleExportPDF = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleExportMarkdown = () => {
    const text = editor.getText();
    const cleanTitle = documentTitle.toLowerCase().replace(/\s+/g, '-');
    downloadFile(`${cleanTitle}.md`, text, 'text/markdown;charset=utf-8');
  };

  const handleExportHTML = () => {
    const html = editor.getHTML();
    const cleanTitle = documentTitle.toLowerCase().replace(/\s+/g, '-');
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${documentTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background-color: #f1f5f9; font-weight: 600; }
    blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; color: #64748b; font-style: italic; }
    pre { background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    downloadFile(`${cleanTitle}.html`, fullHtml, 'text/html;charset=utf-8');
  };

  const handleExportText = () => {
    const text = editor.getText();
    const cleanTitle = documentTitle.toLowerCase().replace(/\s+/g, '-');
    downloadFile(`${cleanTitle}.txt`, text, 'text/plain;charset=utf-8');
  };

  const copyToClipboard = (type: 'html' | 'text') => {
    const content = type === 'html' ? editor.getHTML() : editor.getText();
    navigator.clipboard.writeText(content);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Export Document</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-5 space-y-2.5">
          {/* PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Print to PDF
                </div>
                <div className="text-[11px] text-slate-400">High-resolution paginated document</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              .pdf
            </span>
          </button>

          {/* Markdown */}
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Markdown File
                </div>
                <div className="text-[11px] text-slate-400">Standard GitHub-flavored Markdown</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              .md
            </span>
          </button>

          {/* HTML */}
          <button
            type="button"
            onClick={handleExportHTML}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Standalone Webpage
                </div>
                <div className="text-[11px] text-slate-400">Styled HTML with embedded styles</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              .html
            </span>
          </button>

          {/* Plain Text */}
          <button
            type="button"
            onClick={handleExportText}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Plain Text
                </div>
                <div className="text-[11px] text-slate-400">Unformatted raw text document</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              .txt
            </span>
          </button>

          {/* Quick Copy to Clipboard */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard('text')}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {copiedFormat === 'text' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard('html')}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {copiedFormat === 'html' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
