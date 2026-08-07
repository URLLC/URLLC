import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((d.getTime() - now.getTime()) / 86400000);

  if (diffDays === 0) {
    return `今天 ${d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  } else if (diffDays === 1) {
    return `明天 ${d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  } else if (diffDays < 7) {
    return `${d.toLocaleDateString("zh-CN", { weekday: "short" })} ${d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
  }
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
}

export function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const hours = Math.max(0, Math.floor(diff / 3600000));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天后`;
  if (hours > 0) return `${hours}小时后`;
  return "即将开始";
}

export function getInitials(name: string): string {
  return name.slice(0, 1);
}
