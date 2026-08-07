"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Calendar, Eye, MapPin, Sparkles, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useCity } from "@/lib/city-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VibeTagGroup } from "@/components/vibe-tag";
import { VIBE_TAGS } from "@/lib/mock-data";

const LocationPicker = dynamic(() => import("@/components/location-picker"), { ssr: false });
const atmosphereTags = VIBE_TAGS.filter((tag) => tag.type === "atmosphere");
const sceneTags = VIBE_TAGS.filter((tag) => tag.type === "scene");

export default function CreateSessionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { city } = useCity();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(-35.2809);
  const [longitude, setLongitude] = useState(149.13);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxPeople, setMaxPeople] = useState("4");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleTag = (tagName: string) => setSelectedTags((current) => current.includes(tagName) ? current.filter((tag) => tag !== tagName) : [...current, tagName]);
  const canSubmit = Boolean(user && title.trim() && location.trim() && startDate && startTime && !submitting);
  const startAt = startDate && startTime ? new Date(`${startDate}T${startTime}:00`) : null;

  const preview = useMemo(() => ({
    title: title || "一个新的搭子局",
    location: location || "选择一个大家好找的地点",
    date: startAt ? startAt.toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : "时间待定",
  }), [title, location, startAt]);

  const publish = async () => {
    if (!user) { router.push("/login"); return; }
    if (!startAt || startAt.getTime() <= Date.now()) { setError("请选择未来的活动时间"); return; }
    setSubmitting(true);
    setError("");
    const { data: created, error: createError } = await supabase.from("sessions").insert({
      creator_id: user.id,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      latitude,
      longitude,
      city,
      start_time: startAt.toISOString(),
      max_people: Number(maxPeople),
      status: "open",
    }).select("id").single();

    if (createError || !created) { setError(createError?.message || "发布失败，请稍后重试"); setSubmitting(false); return; }
    const tagRows = selectedTags.map((tagName) => ({ session_id: created.id, tag_name: tagName, tag_type: VIBE_TAGS.find((tag) => tag.name === tagName)?.type || "scene" }));
    const writes = [supabase.from("session_members").insert({ session_id: created.id, user_id: user.id })];
    if (tagRows.length) writes.push(supabase.from("session_tags").insert(tagRows));
    const results = await Promise.all(writes);
    const writeError = results.find((result) => result.error)?.error;
    if (writeError) { setError(`活动已创建，但部分信息保存失败：${writeError.message}`); setSubmitting(false); return; }
    router.replace(`/session/${created.id}`);
  };

  if (!authLoading && !user) {
    return <div className="mx-auto max-w-md py-20 text-center"><div className="rounded-3xl bg-white p-8 shadow-sm"><Sparkles className="mx-auto h-8 w-8 text-purple-500" /><h1 className="mt-4 text-xl font-bold">先登录，再发起计划</h1><p className="mt-2 text-sm text-gray-500">一场好活动，从明确的时间和地点开始。</p><Link href="/login" className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white">去登录</Link></div></div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div className="flex items-center gap-3"><Link href="/" className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-600 shadow-sm hover:text-purple-600"><ArrowLeft className="h-5 w-5" /></Link><div><p className="text-xs font-bold uppercase tracking-[.18em] text-purple-500">Create</p><h1 className="text-2xl font-black tracking-tight text-gray-950">发起一个具体的计划</h1></div></div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="border-white shadow-sm"><CardHeader><CardTitle>这次想做什么？</CardTitle><CardDescription>写得越具体，越容易遇到合拍的人。</CardDescription></CardHeader><CardContent className="space-y-4"><Field label="活动标题" required><Input placeholder="例如：周六下午在 ANU 一起自习" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={60} /></Field><Field label="补充说明"><Textarea placeholder="可以写上计划、费用、适合什么样的搭子…" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} /></Field></CardContent></Card>
          <Card className="border-white shadow-sm"><CardHeader><CardTitle>时间与地点</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Field label="日期" required><Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></Field><Field label="时间" required><Input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></Field></div><Field label="集合地点" required><Input placeholder="例如：Canberra Centre 正门" value={location} onChange={(event) => setLocation(event.target.value)} /></Field><div className="h-44 overflow-hidden rounded-2xl border border-gray-100"><LocationPicker latitude={latitude} longitude={longitude} onChange={(lat: number, lng: number) => { setLatitude(lat); setLongitude(lng); }} /></div></CardContent></Card>
          <Card className="border-white shadow-sm"><CardHeader><CardTitle>人数与氛围</CardTitle></CardHeader><CardContent className="space-y-5"><Field label="人数上限" required><Select value={maxPeople} onChange={(event) => setMaxPeople(event.target.value)}>{[2,3,4,5,6,8,10].map((number) => <option key={number} value={number}>{number} 人</option>)}</Select></Field><div><p className="mb-3 text-xs font-medium text-gray-500"><Sparkles className="mr-1 inline h-3.5 w-3.5" />Vibe 标签</p><div className="space-y-4"><VibeTagGroup tags={atmosphereTags} selectedTags={selectedTags} onToggle={toggleTag} label="氛围" /><VibeTagGroup tags={sceneTags} selectedTags={selectedTags} onToggle={toggleTag} label="场景" /></div></div></CardContent></Card>
        </div>
        <aside className="lg:sticky lg:top-24 h-fit space-y-3"><div className="overflow-hidden rounded-3xl bg-gray-950 p-1 text-white shadow-xl shadow-purple-200/50"><div className="h-36 rounded-[1.3rem] bg-gradient-to-br from-purple-500 via-fuchsia-400 to-orange-300 p-5"><span className="rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-bold">活动预览</span><h2 className="mt-5 line-clamp-2 text-lg font-bold leading-snug">{preview.title}</h2></div><div className="space-y-3 p-5 text-sm text-white/70"><p className="flex gap-2"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />{preview.date}</p><p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />{preview.location}</p><p className="flex gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />最多 {maxPeople} 人</p></div></div>{error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}<Button onClick={publish} disabled={!canSubmit} className="h-12 w-full rounded-xl bg-purple-600 text-base font-bold shadow-lg shadow-purple-200 hover:bg-purple-700">{submitting ? "正在发布…" : "发布活动"}</Button><p className="px-4 text-center text-[11px] leading-5 text-gray-400">发布即表示你会认真组织这次活动。活动开始前可以取消。</p></aside>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-gray-500">{label}{required && <span className="ml-1 text-purple-500">*</span>}</span>{children}</label>;
}
