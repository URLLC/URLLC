"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { VIBE_TAGS } from "@/lib/mock-data";
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SessionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [actionError, setActionError] = useState("");
  const [acting, setActing] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch session with creator
    supabase.from("sessions").select("*, creator:users!sessions_creator_id_fkey(id,name,avatar,school)").eq("id", id).single()
      .then(({ data }) => { setSession(data); setLoading(false); });

    // Fetch tags
    supabase.from("session_tags").select("*").eq("session_id", id).then(({ data }) => setTags(data || []));

    loadMembers();

    // Fetch comments
    supabase.from("session_comments").select("*, user:users(id,name,avatar)").eq("session_id", id).order("created_at", { ascending: true })
      .then(({ data }) => setComments(data || []));
  }, [id, user?.id]);

  const loadMembers = async () => {
    const { data } = await supabase.from("session_members").select("*, user:users!session_members_user_id_fkey(id,name,avatar,school)").eq("session_id", id).order("joined_at", { ascending: true });
    setMembers(data || []);
    if (user?.id) setIsJoined((data || []).some((member: any) => member.user_id === user.id));
  };

  const handleJoin = async () => {
    if (!user) { router.push("/login"); return; }
    if (members.length >= session.max_people) { setActionError("这个活动已经满员了"); return; }
    setActing(true); setActionError("");
    const { error } = await supabase.from("session_members").insert({ session_id: id, user_id: user.id });
    setActing(false);
    if (error) { setActionError(error.code === "23505" ? "你已经加入这个活动了" : error.message === "activity_full" ? "这个活动已经满员了" : "加入失败，请稍后重试"); return; }
    await loadMembers();
  };

  const handleLeave = async () => {
    if (!user) return;
    if (session && new Date(session.start_time).getTime() - Date.now() < 2 * 3600000) return;
    setActing(true); setActionError("");
    const { error } = await supabase.from("session_members").delete().eq("session_id", id).eq("user_id", user.id);
    setActing(false);
    if (error) { setActionError("退出失败，请稍后重试。"); return; }
    await loadMembers();
  };

  const handleComment = async () => {
    if (!user) { router.push("/login"); return; }
    if (!newComment.trim()) return;
    setCommenting(true); setActionError("");
    const { error } = await supabase.from("session_comments").insert({ session_id: id, user_id: user.id, content: newComment.trim() });
    setCommenting(false);
    if (error) { setActionError("评论发送失败，请稍后重试。"); return; }
    setNewComment("");
    // Refresh comments
    supabase.from("session_comments").select("*, user:users(id,name,avatar)").eq("session_id", id).order("created_at", { ascending: true })
      .then(({ data }) => setComments(data || []));
  };

  const shareSession = async () => {
    try {
      if (navigator.share) await navigator.share({ title: session?.title, text: session?.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice("活动链接已复制。"); }
    } catch {
      // Closing the native share sheet is not an error.
    }
  };

  const cancelSession = async () => {
    if (!session || !user || user.id !== session.creator_id || new Date(session.start_time).getTime() <= Date.now()) return;
    if (!window.confirm("确认取消这场活动吗？已加入的成员将无法继续报名。")) return;
    setActing(true); setActionError("");
    const { error } = await supabase.from("sessions").update({ status: "closed" }).eq("id", id);
    setActing(false);
    if (error) { setActionError("取消活动失败，请稍后重试。"); return; }
    setSession((current: any) => ({ ...current, status: "closed" }));
    setNotice("活动已取消，不再接受新的报名。");
  };

  if (loading) return <div className="max-w-lg mx-auto pt-20"><div className="h-52 bg-gray-100 rounded-2xl animate-pulse mb-4" /><div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse mb-2" /><div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" /></div>;

  if (!session) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-gray-500">局不存在或已结束</p>
      <Link href="/"><Button variant="outline" size="sm" className="mt-4">返回广场</Button></Link>
    </div>
  );

  const canExit = new Date(session.start_time).getTime() > Date.now() + 2 * 3600000;
  const isCreator = user?.id === session.creator_id;
  const isFull = members.length >= session.max_people;
  const hasStarted = new Date(session.start_time).getTime() <= Date.now();

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex items-center gap-2">
          <button onClick={shareSession} className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-purple-700" aria-label="分享活动"><Share2 className="h-5 w-5" /></button>
        </div>
      </div>

      {notice && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300">
        {session.cover_image && <img src={session.cover_image} alt={session.title} className="w-full h-full object-cover" />}
      </div>

      {/* Title & Info */}
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-gray-900 leading-snug">{session.title}</h1>

        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((t: any) => {
            const def = VIBE_TAGS.find((v) => v.name === t.tag_name);
            return <span key={t.id} className="text-xs bg-purple-50 text-purple-500 px-2 py-1 rounded-full font-medium">{def?.emoji} {t.tag_name}</span>;
          })}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4 text-gray-400" /><span>{new Date(session.start_time).toLocaleDateString("zh-CN")} {new Date(session.start_time).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })}</span></div>
          <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4 text-gray-400" /><span>{session.location}</span></div>
          <div className="flex items-center gap-2 text-gray-600"><Users className="h-4 w-4 text-gray-400" /><span>{members.length}/{session.max_people} 人已加入</span></div>
        </div>
      </div>

      {/* 局主说 */}
      <div className="bg-purple-50/50 rounded-2xl p-4">
        <p className="text-xs font-medium text-purple-600 mb-2">💬 局主说</p>
        <p className="text-sm text-gray-700 leading-relaxed">{session.description || "暂无说明"}</p>
      </div>

      {/* 已加入的搭子 */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-3">已加入的搭子</p>
        <div className="space-y-2">
          {members.map((m: any) => (
            <Link key={m.id} href={`/user/${m.user_id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Avatar name={m.user?.name || "?"} size="md" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{m.user?.name || "?"} {m.user_id === session.creator_id && <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full ml-1">局主</span>}</p>
                <p className="text-xs text-gray-400">{m.user?.school || ""}</p>
              </div>
            </Link>
          ))}
          {members.length === 0 && <p className="text-sm text-gray-400 text-center py-3">还没有人加入，来做第一个吧</p>}
        </div>
      </div>

      {/* Comments */}
      <div className="pb-24 md:pb-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">评论 ({comments.length})</p>
        <div className="space-y-3">
          {comments.map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <Avatar name={c.user?.name || "?"} size="sm" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700">{c.user?.name || "?"}</p>
                <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join / Comment bar */}
      <div className="fixed bottom-16 left-0 right-0 px-4 md:static md:px-0 z-40 bg-white md:bg-transparent py-3 md:py-0 border-t md:border-0">
        <div className="max-w-lg mx-auto md:m-0 space-y-2">
          {isCreator && session.status === "open" && !hasStarted ? (
            <Button variant="outline" disabled={acting} className="w-full h-11 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={cancelSession}>取消活动</Button>
          ) : isJoined ? (
            <Button variant="secondary" className="w-full h-12 text-base" disabled={!canExit} onClick={handleLeave}>
              {canExit ? "退出此局" : "开始前2小时不能退出"}
            </Button>
          ) : session.status === "open" && !hasStarted ? (
            <Button disabled={acting || isFull} className="w-full h-12 text-base bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-200 rounded-2xl" onClick={handleJoin}>
              {acting ? "正在加入…" : isFull ? "这个活动已满员" : "加入活动"}
            </Button>
          ) : null}

          {actionError && <p className="text-center text-xs text-red-500">{actionError}</p>}

          <div className="flex items-center gap-2">
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)} maxLength={300} placeholder="写评论..."
              className="flex-1 h-10 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:border-purple-300" />
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600" onClick={handleComment} disabled={commenting || !newComment.trim()}>{commenting ? "发送中" : "发送"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
