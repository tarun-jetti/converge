'use client';

import React, { useState } from 'react';
import { Share2, X, Check, Copy, Shield, Users, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export function ShareModal({ isOpen, onClose, documentTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [invites, setInvites] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://converge.dev';

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setInvites((prev) => [...prev, `${email.trim()} (${role})`]);
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Share & Collaborate</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Invite Input */}
          <form onSubmit={sendInvite} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Invite Collaborator</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-xl px-2.5 outline-none cursor-pointer"
              >
                <option value="editor">Can edit</option>
                <option value="viewer">Can view</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition active:scale-95 shadow-xs shrink-0"
              >
                Invite
              </button>
            </div>
          </form>

          {/* Pending invites list */}
          {invites.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Invited Teammates
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {invites.map((inv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100"
                  >
                    <span>{inv}</span>
                    <span className="text-[10px] font-bold text-emerald-600">Pending Sync</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Link Sharing */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Room URL</span>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live CRDT channel active
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-xs text-slate-500 font-mono truncate flex-1 px-1">
                {currentUrl}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
