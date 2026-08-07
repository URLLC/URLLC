"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { CITIES } from "@/lib/mock-data";
import { BarChart3, ClipboardList, Flag, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, sessions: 0, newToday: 0, reports: 0 });
  const [cityData, setCityData] = useState<{ city: string; flag: string; count: number }[]>([]);

  useEffect(() => {
    supabase.from("users").select("count", { count: "exact", head: true }).eq("is_admin", false).then(({ count }) => setStats((p) => ({ ...p, users: count || 0 })));
    supabase.from("sessions").select("count", { count: "exact", head: true }).then(({ count }) => setStats((p) => ({ ...p, sessions: count || 0 })));
    const today = new Date().toISOString().split("T")[0];
    supabase.from("users").select("count", { count: "exact", head: true }).gte("created_at", today).then(({ count }) => setStats((p) => ({ ...p, newToday: count || 0 })));
    Promise.all(CITIES.map(async (c) => {
      const { count } = await supabase.from("sessions").select("count", { count: "exact", head: true }).eq("city", c.id);
      return { city: c.name, flag: c.country === "AU" ? "🇦🇺" : "🇬🇧", count: count || 0 };
    })).then(setCityData);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">仪表盘</h1>
        <p className="text-sm text-gray-500 mt-0.5">实时数据概览</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="今日新增用户" value={stats.newToday} icon={ClipboardList} color="text-blue-400" />
        <StatCard label="总用户数" value={stats.users} icon={Users} color="text-purple-400" />
        <StatCard label="总组局数" value={stats.sessions} icon={BarChart3} color="text-green-400" />
        <StatCard label="待处理举报" value={stats.reports} icon={Flag} color="text-red-400" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800"><p className="text-sm font-semibold text-gray-200">各城市局数量</p></div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 bg-gray-900/50"><th className="px-5 py-2.5 font-medium">城市</th><th className="px-5 py-2.5 font-medium">国家</th><th className="px-5 py-2.5 font-medium">局数</th></tr></thead>
          <tbody className="divide-y divide-gray-800">
            {cityData.filter((r) => r.count > 0).map((r) => (
              <tr key={r.city} className="hover:bg-gray-800/50"><td className="px-5 py-2.5 text-gray-300 font-medium">{r.city}</td><td className="px-5 py-2.5 text-gray-500">{r.flag}</td><td className="px-5 py-2.5 text-gray-300">{r.count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
