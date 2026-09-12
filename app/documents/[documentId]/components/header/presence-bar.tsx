'use client';

import React from 'react';
import { UserProfile, ConnectionStatus } from '../../types';
import { WifiOff } from 'lucide-react';

interface PresenceBarProps {
  currentUser: UserProfile;
  remotePeers: UserProfile[];
  connectionStatus: ConnectionStatus;
  simulatedLatency: number;
  onOpenProfile: () => void;
}

export function PresenceBar({
  currentUser,
  remotePeers,
  connectionStatus,
  simulatedLatency,
  onOpenProfile,
}: PresenceBarProps) {
  const allUsers = [currentUser, ...remotePeers];

  return (
    <div className="flex items-center gap-2.5">
      {/* Network / Sync Status indicator */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-medium text-slate-600">
        {connectionStatus === 'connected' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-slate-700">{simulatedLatency}ms</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-emerald-700 font-semibold">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-rose-500" />
            <span className="text-rose-600 font-semibold">Disconnected</span>
          </>
        )}
      </div>

      {/* Collaborator Avatars */}
      <div className="flex items-center -space-x-1.5 overflow-hidden p-0.5">
        {allUsers.map((user) => {
          const isMe = user.id === currentUser.id;
          return (
            <button
              key={user.id}
              type="button"
              onClick={isMe ? onOpenProfile : undefined}
              title={`${user.name} (${isMe ? 'You' : user.role})`}
              className={`relative inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-[11px] font-bold ring-2 ring-white transition-transform ${
                isMe ? 'hover:scale-110 cursor-pointer shadow-xs' : 'cursor-default'
              }`}
              style={{ backgroundColor: user.color }}
            >
              {user.avatarText}
              {isMe && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
