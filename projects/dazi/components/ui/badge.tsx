import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "food" | "study" | "game" | "pinned" | "outline";
}

const variants: Record<string, string> = {
  default: "bg-purple-50 text-purple-600",
  food: "bg-green-50 text-green-600",
  study: "bg-blue-50 text-blue-600",
  game: "bg-orange-50 text-orange-600",
  pinned: "bg-gradient-to-r from-purple-500 to-pink-400 text-white",
  outline: "border border-gray-200 text-gray-500",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />
  );
}

export { Badge };
