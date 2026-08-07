"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Save, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VibeTagGroup } from "@/components/vibe-tag";
import { VIBE_TAGS } from "@/lib/mock-data";

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [name, setName] = useState(""); const [school, setSchool] = useState(""); const [grade, setGrade] = useState(""); const [bio, setBio] = useState(""); const [tags, setTags] = useState<string[]>([]); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState("");
  useEffect(() => { if (!user) return; supabase.from("users").select("name,school,grade,bio,vibe_tags").eq("id", user.id).single().then(({ data }) => { if (!data) return; setName(data.name || ""); setSchool(data.school || ""); setGrade(data.grade || ""); setBio(data.bio || ""); setTags(data.vibe_tags || []); }); }, [user?.id]);
  if (!authLoading && !user) return <div className="py-20 text-center"><p className="text-gray-500">请先登录。</p><Link href="/login" className="mt-4 inline-flex rounded-xl bg-gray-950 px-4 py-2 text-sm text-white">去登录</Link></div>;
  const save = async () => { if (!user) return; setSaving(true); setNotice(""); const { error } = await supabase.from("users").update({ name: name.trim(), school: school.trim(), grade: grade.trim(), bio: bio.trim(), vibe_tags: tags }).eq("id", user.id); setSaving(false); setNotice(error ? "保存失败，请稍后重试。" : "资料已保存。"); };
  const toggle = (tag: string) => setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  return <div className="mx-auto max-w-2xl space-y-6 pb-10"><div className="flex items-center gap-3"><Link href={user ? `/user/${user.id}` : "/"} className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-500 shadow-sm"><ArrowLeft className="h-5 w-5" /></Link><div><p className="text-xs font-bold uppercase tracking-[.18em] text-purple-500">Profile</p><h1 className="text-2xl font-black">完善个人资料</h1></div></div><div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm"><p className="rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-800"><Sparkles className="mr-2 inline h-4 w-4" />真实、清楚的资料能让大家更安心地参加你的活动。</p><label className="block text-sm font-medium text-gray-700">昵称<Input className="mt-1.5" value={name} onChange={(event) => setName(event.target.value)} maxLength={20} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-gray-700">学校<Input className="mt-1.5" value={school} onChange={(event) => setSchool(event.target.value)} placeholder="例如 ANU" /></label><label className="text-sm font-medium text-gray-700">年级 / 状态<Input className="mt-1.5" value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="例如 Master" /></label></div><label className="block text-sm font-medium text-gray-700">一句自我介绍<Textarea className="mt-1.5" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={160} placeholder="喜欢做什么、希望认识什么样的搭子？" /></label><div><p className="mb-3 text-sm font-medium text-gray-700">我的 vibe</p><VibeTagGroup tags={VIBE_TAGS} selectedTags={tags} onToggle={toggle} /></div>{notice && <p className={`rounded-xl px-3 py-2 text-sm ${notice.includes("失败") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{notice}</p>}<button onClick={save} disabled={saving || !name.trim()} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-bold text-white hover:bg-purple-600 disabled:opacity-50">{saving ? "保存中…" : <><Save className="h-4 w-4" /> 保存资料</>}</button></div><button onClick={() => signOut()} className="w-full rounded-xl border border-red-100 bg-white py-3 text-sm font-semibold text-red-500 hover:bg-red-50">退出登录</button></div>;
}
