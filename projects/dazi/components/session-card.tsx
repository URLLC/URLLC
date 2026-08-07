"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTime, timeUntil, cn } from "@/lib/utils";
import type { Session } from "@/lib/types";
import { Clock, Heart, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SessionCardProps {
  session: Session;
  variant?: "card" | "row";
  className?: string;
}

const CATEGORY_COLORS: Record<string, "food" | "study" | "game"> = {
  "纯饭搭子": "food",
  "探店": "food",
  "期末发疯": "study",
  "微醺": "game",
  "citywalk": "game",
  "AA": "food",
};

const COVER_GRADIENTS = [
  "from-purple-500 via-pink-400 to-orange-300",
  "from-blue-500 via-cyan-400 to-teal-300",
  "from-green-500 via-emerald-400 to-lime-300",
  "from-orange-500 via-yellow-400 to-pink-300",
  "from-violet-500 via-purple-400 to-indigo-300",
  "from-rose-500 via-red-400 to-orange-300",
  "from-teal-500 via-green-400 to-emerald-300",
  "from-amber-500 via-orange-400 to-red-300",
];

function hashGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COVER_GRADIENTS[Math.abs(hash) % COVER_GRADIENTS.length];
}

function getCategoryVariant(tags: Session["tags"]): "food" | "study" | "game" {
  for (const t of tags) {
    if (CATEGORY_COLORS[t.tagName]) return CATEGORY_COLORS[t.tagName];
  }
  return "game";
}

const CATEGORY_LABELS: Record<string, string> = {
  food: "美食探店",
  study: "学习搭子",
  game: "休闲娱乐",
};

export function SessionCard({ session, variant = "card", className }: SessionCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const category = getCategoryVariant(session.tags);
  const gradient = hashGradient(session.id);

  if (variant === "row") {
    return (
      <Link href={`/session/${session.id}`} className={cn("block", className)}>
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          {session.coverImage && !imgError ? (
            <img src={session.coverImage} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" onError={() => setImgError(true)} />
          ) : (
            <div className={cn("h-14 w-14 rounded-xl bg-gradient-to-br shrink-0", gradient)} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session.title}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeUntil(session.startTime)}</span>
              <span>{session.currentPeople}/{session.maxPeople}人</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/session/${session.id}`} className={cn("block group", className)}>
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover Image */}
        <div className={cn("relative h-36", !session.coverImage || imgError ? `bg-gradient-to-br ${gradient}` : "")}>
          {session.coverImage && !imgError ? (
            <img src={session.coverImage} alt={session.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : null}
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Category Badge */}
          <Badge variant={category} className="absolute top-3 left-3 text-[11px] backdrop-blur-sm bg-white/90">
            {CATEGORY_LABELS[category]}
          </Badge>

          {/* Like Button */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart className={cn("h-4 w-4 transition-colors", liked ? "fill-red-400 text-red-400" : "text-gray-500")} />
          </button>

          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
              {session.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2.5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {session.tags.slice(0, 3).map((t) => (
              <span key={t.id} className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                {t.tagName}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(session.startTime)}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.location.length > 18 ? session.location.slice(0, 18) + "..." : session.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {session.members.slice(0, 3).map((m) => (
                  <Avatar key={m.id} name={m.name} size="sm" className="ring-2 ring-white" />
                ))}
              </div>
              <span className="text-xs text-gray-400">{session.currentPeople}/{session.maxPeople}</span>
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              new Date(session.startTime).getTime() - Date.now() < 86400000
                ? "bg-purple-50 text-purple-600"
                : "bg-gray-50 text-gray-500"
            )}>
              {timeUntil(session.startTime)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
