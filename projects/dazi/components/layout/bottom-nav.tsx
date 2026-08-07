"use client";

import { cn } from "@/lib/utils";
import { Home, MapPin, MessageCircle, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/", label: "广场", icon: Home },
  { href: "/spots", label: "地图", icon: MapPin },
  { href: "/session/new", label: "", icon: Plus, isCreate: true },
  { href: "/messages", label: "消息", icon: MessageCircle },
  { href: "/me", label: "我的", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 md:hidden">
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 items-end pb-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const href = item.href === "/me" ? (user ? `/user/${user.id}` : "/login") : item.href;
          const isActive = pathname === href;

          if (item.isCreate) {
            return (
              <Link key={i} href={href} className="flex items-center justify-center h-full">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-purple-200 active:scale-95 transition-transform -mt-2">
                  <Icon className="h-6 w-6" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={i}
              href={href}
              className={cn(
                "flex flex-col items-center justify-end gap-0.5 h-full transition-colors",
                isActive ? "text-purple-500" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
