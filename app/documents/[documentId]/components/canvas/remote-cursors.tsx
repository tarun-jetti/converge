'use client';

import React from 'react';
import { RemoteCursor } from '../../types';
import { MousePointer2 } from 'lucide-react';

interface RemoteCursorsProps {
  cursors: RemoteCursor[];
}

export function RemoteCursors({ cursors }: RemoteCursorsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl print:hidden z-20">
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          style={{
            left: `${cursor.x}%`,
            top: `${cursor.y}px`,
            transition: 'all 0.12s cubic-bezier(0, 0, 0.2, 1)',
          }}
          className="absolute flex items-start z-20"
        >
          <MousePointer2
            style={{ color: cursor.color, fill: cursor.color }}
            className="w-4 h-4 -rotate-90 drop-shadow-sm -ml-1 -mt-1"
          />
          <div
            style={{ backgroundColor: cursor.color }}
            className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs whitespace-nowrap ml-1 flex items-center gap-1.5"
          >
            <span>{cursor.name}</span>
            {cursor.activeText && (
              <span className="opacity-80 font-normal hidden sm:inline">
                &bull; {cursor.activeText}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
