"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/avatar";

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from("chat_requests").select("*, from_user:users!chat_requests_from_user_id_fkey(id,name,avatar,school), session:sessions!chat_requests_session_id_fkey(id,title)").eq("to_user_id", user.id).order("created_at", { ascending: false });
    if (queryError) setError("暂时无法加载联系申请。");
    setRequests(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [user?.id]);

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    setError("");
    const { error: updateError } = await supabase.from("chat_requests").update({ status }).eq("id", id);
    if (updateError) { setError("操作失败，请稍后再试。"); return; }
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
  };

  if (!authLoading && !user) return <div className="mx-auto max-w-md py-20 text-center"><MessageCircle className="mx-auto h-10 w-10 text-purple-400" /><h1 className="mt-4 text-xl font-bold">登录后查看消息</h1><p className="mt-2 text-sm text-gray-500">联系申请只对当事人可见。</p><Link href="/login" className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white">去登录</Link></div>;

  const pending = requests.filter((request) => request.status === "pending");
  const handled = requests.filter((request) => request.status !== "pending");
  return <div className="mx-auto max-w-2xl space-y-6 pb-10"><div className="flex items-center gap-3"><Link href="/" className="grid h-10 w-10 place-items-center rounded-xl bg-white text-gray-500 shadow-sm"><ArrowLeft className="h-5 w-5" /></Link><div><p className="text-xs font-bold uppercase tracking-[.18em] text-purple-500">Inbox</p><h1 className="text-2xl font-black tracking-tight">联系申请</h1></div></div><div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-800"><Sparkles className="mr-2 inline h-4 w-4" />为了大家的安全，先从共同参加的活动开始联系。</div>{error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}{loading ? <div className="space-y-3">{[1,2,3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-white" />)}</div> : requests.length === 0 ? <Empty /> : <div className="space-y-7">{pending.length > 0 && <RequestGroup title="等待你回应" requests={pending} onUpdate={updateStatus} />}{handled.length > 0 && <RequestGroup title="已处理" requests={handled} onUpdate={updateStatus} />}</div>}</div>;
}

function RequestGroup({ title, requests, onUpdate }: { title: string; requests: any[]; onUpdate: (id: string, status: "accepted" | "rejected") => void }) {
  return <section><h2 className="mb-3 text-sm font-bold text-gray-800">{title}</h2><div className="space-y-3">{requests.map((request) => <div key={request.id} className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm"><Avatar name={request.from_user?.name || "Dazi 用户"} size="md" /><div className="min-w-0 flex-1"><p className="font-semibold text-gray-900">{request.from_user?.name || "Dazi 用户"}</p><p className="mt-0.5 truncate text-xs text-gray-500">想通过「{request.session?.title || "活动"}」认识你</p></div>{request.status === "pending" ? <div className="flex gap-2"><button onClick={() => onUpdate(request.id, "accepted")} className="grid h-9 w-9 place-items-center rounded-full bg-purple-600 text-white hover:bg-purple-700" aria-label="接受"><Check className="h-4 w-4" /></button><button onClick={() => onUpdate(request.id, "rejected")} className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200" aria-label="拒绝"><X className="h-4 w-4" /></button></div> : <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${request.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{request.status === "accepted" ? "已接受" : "已拒绝"}</span>}</div>)}</div></section>;
}

function Empty() { return <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-purple-100 text-purple-600"><MessageCircle className="h-5 w-5" /></div><h2 className="mt-4 font-bold text-gray-900">还没有联系申请</h2><p className="mt-1 text-sm text-gray-500">参加感兴趣的活动后，就能和同场搭子自然地认识。</p><Link href="/" className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white">去发现活动</Link></div>; }
