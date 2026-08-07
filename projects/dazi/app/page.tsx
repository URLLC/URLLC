"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Plus, Search, Sparkles, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
import { VIBE_TAGS, CITIES } from "@/lib/mock-data";
import { useCity } from "@/lib/city-context";

function formatStart(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }) + " · " + date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function HomePage() {
  const { city } = useCity();
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const cityData = CITIES.find((item) => item.id === city);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    supabase
      .from("sessions")
      .select("*, session_tags(*), creator:users!sessions_creator_id_fkey(id,name,avatar,school)")
      .eq("city", city)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        setSessions(data || []);
        setLoadError(Boolean(error));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [city]);

  const filtered = useMemo(() => sessions.filter((session) => {
    const tagMatch = !activeVibe || session.session_tags?.some((tag: any) => tag.tag_name === activeVibe);
    const text = queryText.trim().toLowerCase();
    const searchMatch = !text || `${session.title} ${session.description || ""} ${session.location || ""}`.toLowerCase().includes(text);
    return tagMatch && searchMatch;
  }), [sessions, activeVibe, queryText]);

  return (
    <div className="space-y-7 md:space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#171426] text-white px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14 shadow-2xl shadow-purple-200/50">
        <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-purple-500/40 blur-3xl" />
        <div className="absolute right-[22%] bottom-[-9rem] h-64 w-64 rounded-full bg-pink-400/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100"><Sparkles className="h-3.5 w-3.5" /> 为海外生活找到同频的人</span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[1.08]">别一个人凑合，<br /><span className="bg-gradient-to-r from-purple-300 via-pink-300 to-orange-200 bg-clip-text text-transparent">一起去做有趣的事。</span></h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-white/65">从一顿饭、一场自习到周末出游。在 {cityData?.name || "你的城市"}，发起一个具体的小计划，认识自然发生。</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/session/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-gray-950 hover:bg-purple-50 transition-colors">发布我的活动 <ArrowRight className="h-4 w-4" /></Link>
            <a href="#discover" className="inline-flex h-11 items-center rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors">看看大家在做什么</a>
          </div>
        </div>
        <div className="absolute right-8 bottom-8 hidden lg:grid grid-cols-2 gap-3 rotate-2">
          {["🍜 饭搭子", "📚 自习搭子", "🚶 Citywalk", "🎲 桌游局"].map((item, index) => <span key={item} className={`rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur-md ${index % 2 ? "translate-y-4" : ""}`}>{item}</span>)}
        </div>
      </section>

      <section id="discover" className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-purple-500">Discover</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-gray-950">发现附近的搭子局</h2>
            <p className="mt-1 text-sm text-gray-500">具体的计划，比尴尬的自我介绍更容易开始。</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={queryText} onChange={(event) => setQueryText(event.target.value)} placeholder="搜索活动、地点…" className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setActiveVibe(null)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${!activeVibe ? "bg-gray-950 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300"}`}>全部</button>
          {VIBE_TAGS.map((tag) => <button key={tag.name} onClick={() => setActiveVibe(activeVibe === tag.name ? null : tag.name)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${activeVibe === tag.name ? "bg-purple-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300"}`}>{tag.emoji} {tag.name}</button>)}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/70" />)}</div>
        ) : loadError ? (
          <div className="glass-panel rounded-3xl px-6 py-14 text-center"><p className="font-bold text-gray-900">暂时无法连接活动数据</p><p className="mt-1 text-sm text-gray-500">请稍后重试，或先发起一个新的活动。</p></div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl px-6 py-14 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-600"><Plus className="h-5 w-5" /></div><p className="mt-4 font-bold text-gray-900">{cityData?.name || "这里"}还没有符合条件的活动</p><p className="mt-1 text-sm text-gray-500">成为第一个发起计划的人。</p><Link href="/session/new" className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white">发起活动</Link></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((session) => <SessionTile key={session.id} session={session} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function SessionTile({ session }: { session: any }) {
  const tags = session.session_tags || [];
  const participantCount = session.current_people ?? 0;
  const isFull = participantCount >= session.max_people;
  return (
    <Link href={`/session/${session.id}`} className="group overflow-hidden rounded-3xl border border-white bg-white shadow-[0_12px_40px_rgba(47,36,94,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(47,36,94,.14)]">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-500 via-fuchsia-400 to-orange-300">
        {session.cover_image && <img src={session.cover_image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
        {session.is_pinned && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-purple-700 backdrop-blur">编辑推荐</span>}
        {isFull && <span className="absolute right-4 top-4 rounded-full bg-gray-950/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">已满员</span>}
        <div className="absolute bottom-4 left-4 right-4"><h3 className="line-clamp-2 text-lg font-bold leading-snug text-white drop-shadow-sm">{session.title}</h3></div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">{tags.slice(0,3).map((tag: any) => <span key={tag.id} className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-medium text-purple-600">{tag.tag_name}</span>)}</div>
        <div className="mt-4 space-y-2 text-xs text-gray-500"><p className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-purple-400" />{formatStart(session.start_time)}</p><p className="flex items-center gap-2 truncate"><MapPin className="h-3.5 w-3.5 text-purple-400" />{session.location}</p></div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3"><div className="flex items-center gap-2"><Avatar name={session.creator?.name || "Dazi"} size="sm" /><span className="max-w-28 truncate text-xs font-medium text-gray-700">{session.creator?.name || "Dazi 用户"}</span></div><span className="flex items-center gap-1 text-xs font-semibold text-gray-500"><Users className="h-3.5 w-3.5" />{participantCount}/{session.max_people}</span></div>
      </div>
    </Link>
  );
}
