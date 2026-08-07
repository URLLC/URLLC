"use client";

import { cn } from "@/lib/utils";
import type { VibeTagDef } from "@/lib/types";
import { X } from "lucide-react";

interface VibeTagProps {
  tag: VibeTagDef | { name: string; emoji?: string };
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  onRemove?: () => void;
}

export function VibeTag({ tag, active = false, onClick, size = "md", onRemove }: VibeTagProps) {
  const isSmall = size === "sm";
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium transition-all duration-200",
        isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        active
          ? "bg-purple-500 text-white shadow-sm shadow-purple-200"
          : "bg-white text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      {"emoji" in tag && tag.emoji ? <span className="text-xs">{tag.emoji}</span> : null}
      {tag.name}
      {onRemove && active && (
        <span className="ml-0.5 inline-flex items-center"><X className="h-3 w-3" /></span>
      )}
    </button>
  );
}

interface VibeTagGroupProps {
  tags: { name: string; emoji?: string }[];
  selectedTags: string[];
  onToggle: (tagName: string) => void;
  label?: string;
}

export function VibeTagGroup({ tags, selectedTags, onToggle, label }: VibeTagGroupProps) {
  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <VibeTag
            key={tag.name}
            tag={tag}
            active={selectedTags.includes(tag.name)}
            onClick={() => onToggle(tag.name)}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
