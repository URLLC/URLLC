"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { MOCK_SESSIONS, COMMUNITY_STATS, MOCK_USERS } from "@/lib/mock-data";
import { type CityId } from "@/lib/types";
import { Flame, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/mini-map"), { ssr: false });

export function Sidebar({ city }: { city: CityId }) {
  const citySessions = MOCK_SESSIONS.filter((s) => s.city === city).sort((a, b) => b.currentPeople - a.currentPeople).slice(0, 3);
  const stats = COMMUNITY_STATS[city] || { sessions: 0, participants: 0, newUsers: 0 };
  const activeUsers = [...MOCK_USERS].sort((a, b) => b.reputationScore - a.reputationScore).slice(0, 5);

  return (
    <aside className="space-y-4">
      {/* Hot sessions */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-400 px-4 py-3">
          <div className="flex items-center gap-2 text-white"><Flame className="h-4 w-4" /><span className="text-sm font-bold">热门搭子局</span></div>
        </div>
        <CardContent className="p-0 divide-y divide-gray-50">
          {citySessions.map((s, i) => (
            <Link key={s.id} href={`/session/${s.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-500" : "bg-orange-50 text-orange-500"}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                <p className="text-xs text-gray-400">{s.currentPeople}/{s.maxPeople}人</p>
              </div>
            </Link>
          ))}
          {citySessions.length === 0 && <p className="text-xs text-gray-400 text-center py-4">暂无数据</p>}
        </CardContent>
      </Card>

      {/* Mini Map */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-500" /><span className="text-sm font-semibold">附近热门</span></div>
          <Link href="/spots" className="text-xs text-purple-500 hover:text-purple-600 font-medium">更多 →</Link>
        </div>
        <div className="h-40"><MiniMap sessions={MOCK_SESSIONS.filter((s) => s.city === city)} /></div>
      </Card>

      {/* Active Users */}
      <Card>
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2"><Users className="h-4 w-4 text-purple-500" /><span className="text-sm font-semibold">活跃搭子</span></div>
        <CardContent className="p-0 divide-y divide-gray-50">
          {activeUsers.map((u) => (
            <Link key={u.id} href={`/user/${u.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
              <Avatar name={u.name} size="sm" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.school}</p></div>
              <div className="flex items-center gap-1 text-xs text-gray-500"><Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{u.reputationScore}</div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">本周社区动态</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-50 rounded-xl p-2"><p className="text-lg font-bold text-purple-600">{stats.sessions}</p><p className="text-[10px] text-purple-500">组局</p></div>
            <div className="bg-pink-50 rounded-xl p-2"><p className="text-lg font-bold text-pink-600">{stats.participants}</p><p className="text-[10px] text-pink-500">参与</p></div>
            <div className="bg-indigo-50 rounded-xl p-2"><p className="text-lg font-bold text-indigo-600">{stats.newUsers}</p><p className="text-[10px] text-indigo-500">新人</p></div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
