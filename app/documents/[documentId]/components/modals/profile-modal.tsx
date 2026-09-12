'use client';

import React from 'react';
import { User, X, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

const PRESENCE_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Slate', hex: '#475569' },
];

export function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Collaborator Profile</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Preview Avatar Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div
              style={{ backgroundColor: currentUser.color }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-sm"
            >
              {currentUser.avatarText}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Collaborator</span>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
            <input
              type="text"
              value={currentUser.name}
              onChange={(e) => {
                const name = e.target.value;
                const initials = name.slice(0, 2).toUpperCase() || 'ME';
                onSaveProfile({ name, avatarText: initials });
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition"
            />
          </div>

          {/* Color Matrix */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Cursor & Presence Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESENCE_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onSaveProfile({ color: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`h-8 rounded-xl flex items-center justify-center text-white transition-transform ${
                    currentUser.color === c.hex
                      ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 shadow-xs'
                      : 'hover:scale-102'
                  }`}
                  title={c.name}
                >
                  {currentUser.color === c.hex && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
