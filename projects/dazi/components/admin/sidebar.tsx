"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { BarChart3, ClipboardList, Flag, Image, Key, MessageSquare, ShieldAlert, Sparkles, Users, UserCog, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Group {
  label: string;
  items: { href: string; label: string; icon: any }[];
}

const groups: Group[] = [
  {
    label: "仪表盘",
    items: [{ href: "/admin", label: "概览", icon: BarChart3 }],
  },
  {
    label: "内容管理",
    items: [
      { href: "/admin/sessions", label: "局管理", icon: ClipboardList },
      { href: "/admin/reports", label: "举报中心", icon: Flag },
      { href: "/admin/audit", label: "审核流水", icon: MessageSquare },
    ],
  },
  {
    label: "用户管理",
    items: [
      { href: "/admin/users", label: "普通用户", icon: Users },
      { href: "/admin/admins", label: "管理员", icon: UserCog },
      { href: "/admin/accounts", label: "账号管理", icon: Key },
    ],
  },
  {
    label: "系统工具",
    items: [
      { href: "/admin/images", label: "图片库", icon: Image },
      { href: "/admin/words", label: "违禁词库", icon: ShieldAlert },
      { href: "/admin/helper", label: "冷启动助手", icon: Sparkles },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    supabase.from("reports").select("count", { count: "exact", head: true }).eq("status", "pending")
      .then(({ count }) => setPendingReports(count || 0));
  }, []);

  const toggle = (label: string) => {
    setCollapsed((p) => ({ ...p, [label]: !p[label] }));
  };

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-gray-950 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold">D</div>
          <span className="text-sm font-bold text-gray-100">搭子后台</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map((group) => {
          const isFirst = group.label === "仪表盘";
          const isOpen = collapsed[group.label] !== true;

          return (
            <div key={group.label}>
              {!isFirst && (
                <button
                  onClick={() => toggle(group.label)}
                  className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
                >
                  <ChevronDown className={cn("h-3 w-3 transition-transform", !isOpen && "-rotate-90")} />
                  {group.label}
                </button>
              )}
              {(isFirst || isOpen) && (
                <div className={cn("space-y-0.5", !isFirst && "mt-1")}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive ? "bg-purple-500/15 text-purple-400 font-medium" : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {item.href === "/admin/reports" && pendingReports > 0 && <span className="ml-auto h-2 w-2 rounded-full bg-red-400" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Version */}
      <div className="p-3 border-t border-gray-800">
        <p className="text-[10px] text-gray-600">v1.0 · Dazi Admin</p>
      </div>
    </aside>
  );
}
