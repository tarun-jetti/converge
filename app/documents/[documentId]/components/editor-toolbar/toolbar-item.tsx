"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  icon: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}

export function ToolbarButton({
  icon: Icon,
  isActive = false,
  disabled = false,
  onClick,
  title,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // Keeps editor focus intact
      onClick={onClick}
      className={`p-1.5 rounded transition-colors flex items-center justify-center ${
        isActive
          ? "bg-slate-200 text-slate-900 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}