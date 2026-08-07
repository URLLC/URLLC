"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Clock, MapPin, Search, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCity } from "@/lib/city-context";
import { CITIES, VIBE_TAGS } from "@/lib/mock-data";
import type { MapSession } from "@/components/full-map";

const FullMap = dynamic(() => import("@/components/full-map"), { ssr: false });

type BrowseSession = MapSession & {
  start_time: string;
  max_people: number;
  current_people?: number | null;
  session_tags?: { id: string; tag_name: string }[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-CN", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

export default function SpotsPage() {
  const { city } = useCity();
  const [sessions, setSessions] = useState<BrowseSession[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cityData = CITIES.find((item) => item.id === city) || CITIES[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    supabase
      .from("sessions")
      .select("id,title,location,latitude,longitude,start_time,max_people,current_people,creator:users!sessions_creator_id_fkey(name),session_tags(id,tag_name)")
      .eq("city", city)
      .eq("status", "open")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) setError("暂时无法加载地图活动，请稍后重试。");
        setSessions((data || []) as BrowseSession[]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [city]);

  const visibleSessions = useMemo(() => sessions.filter((session) => (
    (session.current_people ?? 0) < session.max_people
    && (!activeTag || session.session_tags?.some((tag) => tag.tag_name === activeTag))
  )), [sessions, activeTag]);

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-purple-500">Explore</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950">{cityData.name} 的活动地图</h1>
        <p className="mt-1 text-sm text-gray-500">只展示尚未开始、可加入的真实活动。</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setActiveTag(null)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${!activeTag ? "bg-gray-950 text-white" : "border border-gray-200 bg-white text-gray-500"}`}>全部</button>
        {VIBE_TAGS.map((tag) => <button key={tag.name} onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${activeTag === tag.name ? "bg-purple-600 text-white" : "border border-gray-200 bg-white text-gray-500"}`}>{tag.emoji} {tag.name}</button>)}
      </div>

      <div className="h-72 overflow-hidden rounded-3xl border border-white bg-white shadow-sm sm:h-96">
        <FullMap spots={[]} sessions={visibleSessions} center={cityData.center} />
      </div>

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="grid gap-3 sm:grid-cols-2"><div className="h-24 animate-pulse rounded-2xl bg-white" /><div className="h-24 animate-pulse rounded-2xl bg-white" /></div> : visibleSessions.length === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm"><Search className="mx-auto h-6 w-6 text-purple-500" /><h2 className="mt-3 font-bold text-gray-900">暂时没有符合条件的活动</h2><p className="mt-1 text-sm text-gray-500">换一个标签，或者成为第一个发起计划的人。</p><Link href="/session/new" className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white">发起活动</Link></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleSessions.map((session) => <Link key={session.id} href={`/session/${session.id}`} className="group rounded-2xl border border-white bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-bold text-gray-900 group-hover:text-purple-700">{session.title}</h2><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-500"><MapPin className="h-3.5 w-3.5 text-purple-400" />{session.location}</p></div><span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700">{session.current_people ?? 0}/{session.max_people}</span></div><div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-purple-400" />{formatDate(session.start_time)}</span><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-purple-400" />{session.creator?.name || "Dazi 用户"}</span></div></Link>)}
        </div>
      )}
    </div>
  );
}
