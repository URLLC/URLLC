"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VibeTag } from "@/components/vibe-tag";
import { VIBE_TAGS } from "@/lib/mock-data";
import { ArrowLeft, Clock, MessageCircle, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contacting, setContacting] = useState(false);
  const [contactNotice, setContactNotice] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setCurrentUser(data.session?.user || null));
  }, []);

  useEffect(() => {
    supabase.from("users").select("*").eq("id", id).single().then(({ data }) => setProfile(data));

    // Sessions user created or joined
    supabase.from("session_members").select("session_id").eq("user_id", id).then(({ data: memberships }) => {
      const ids = [...new Set((memberships || []).map((m: any) => m.session_id))];
      if (ids.length > 0) {
        supabase.from("sessions").select("*").in("id", ids).order("created_at", { ascending: false }).limit(10)
          .then(({ data }) => setSessions(data || []));
      }
    });
  }, [id]);

  if (!profile) return <div className="max-w-lg mx-auto pt-20"><div className="h-20 bg-gray-100 rounded-2xl animate-pulse" /></div>;

  const isSelf = currentUser?.id === id;
  const userTags = (profile.vibe_tags || []).map((name: string) => VIBE_TAGS.find((v) => v.name === name)).filter(Boolean);

  const requestContact = async () => {
    if (!currentUser) { router.push("/login"); return; }
    setContacting(true);
    setContactNotice("");

    const [{ data: myMemberships, error: myError }, { data: theirMemberships, error: theirError }] = await Promise.all([
      supabase.from("session_members").select("session_id").eq("user_id", currentUser.id),
      supabase.from("session_members").select("session_id").eq("user_id", id),
    ]);
    if (myError || theirError) {
      setContactNotice("暂时无法确认共同活动，请稍后重试。");
      setContacting(false);
      return;
    }

    const mySessionIds = new Set((myMemberships || []).map((membership: any) => membership.session_id));
    const sharedSessionId = (theirMemberships || []).find((membership: any) => mySessionIds.has(membership.session_id))?.session_id;
    if (!sharedSessionId) {
      setContactNotice("先加入同一场活动，才能发送联系申请。");
      setContacting(false);
      return;
    }

    const { data: existingRequest, error: existingError } = await supabase
      .from("chat_requests")
      .select("id, status")
      .eq("from_user_id", currentUser.id)
      .eq("to_user_id", id)
      .eq("session_id", sharedSessionId)
      .maybeSingle();

    if (existingError) {
      setContacting(false);
      setContactNotice("暂时无法检查联系申请，请稍后重试。");
      return;
    }

    if (existingRequest) {
      setContacting(false);
      setContactNotice(existingRequest.status === "accepted" ? "对方已经同意联系申请，可以继续聊啦。" : "这场活动的联系申请已经发出，等对方确认就好。");
      return;
    }

    const { error } = await supabase.from("chat_requests").insert({
      from_user_id: currentUser.id,
      to_user_id: id,
      session_id: sharedSessionId,
      status: "pending",
    });
    setContacting(false);
    setContactNotice(error ? "联系申请发送失败，请稍后重试。" : "联系申请已发送，等待对方回应。");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> 返回</Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={profile.name || "?"} size="lg" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{profile.name || "?"}</h1>
            <p className="text-xs text-gray-400">{profile.school || ""} {profile.grade ? `· ${profile.grade}` : ""}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {isSelf ? (
            <Link href="/settings" className="p-2 text-gray-500"><Settings className="h-5 w-5" /></Link>
          ) : <Button size="sm" onClick={requestContact} disabled={contacting} className="rounded-xl bg-purple-600 hover:bg-purple-700"><MessageCircle className="h-4 w-4" /> {contacting ? "发送中…" : "想聊"}</Button>}
        </div>
      </div>

      <p className="text-sm text-gray-600">{profile.bio || "这个人很懒，什么都没写"}</p>
      {contactNotice && <p className={`rounded-xl px-3 py-2 text-sm ${contactNotice.includes("已发送") ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{contactNotice}</p>}

      <div className="flex items-center justify-around py-4 bg-white rounded-2xl border border-gray-50">
        <div className="text-center"><p className="text-xl font-bold text-gray-900">{sessions.filter((s) => s.creator_id === id).length}</p><p className="text-xs text-gray-400">发起的局</p></div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center"><p className="text-xl font-bold text-gray-900">{sessions.length}</p><p className="text-xs text-gray-400">参加的局</p></div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center"><p className="text-xl font-bold text-gray-900">{((profile.reputation_score || 5) * 30).toFixed(0)}</p><p className="text-xs text-gray-400">信誉分</p></div>
      </div>

      {userTags.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2.5">我的标签</p>
          <div className="flex flex-wrap gap-1.5">{userTags.map((t: any) => <VibeTag key={t.name} tag={t} size="sm" />)}</div>
        </div>
      )}

      {sessions.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-3">最近参加的局</p>
          <div className="space-y-2">
            {sessions.map((s) => (
              <Link key={s.id} href={`/session/${s.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-50 hover:shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{new Date(s.start_time).toLocaleDateString("zh-CN")}</span>
                    <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{s.max_people}人</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
