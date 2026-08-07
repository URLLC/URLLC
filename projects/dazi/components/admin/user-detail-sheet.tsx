"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Shield, ShieldOff, Minus, Plus, UserCheck, UserX, Calendar, School, Star, MessageSquare } from "lucide-react";
import { VIBE_TAGS } from "@/lib/mock-data";

interface UserDetailSheetProps {
  userId: string | null;
  onClose: () => void;
}

export function UserDetailSheet({ userId, onClose }: UserDetailSheetProps) {
  const [user, setUser] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setUser(null); return; }
    supabase.from("users").select("*").eq("id", userId).single()
      .then(({ data }) => setUser(data || null));
  }, [userId]);

  if (!userId || !user) return null;

  const isBanned = false; // We don't have a banned field yet, proxy via reputation
  const userTags = (user.vibe_tags || []).map((name: string) => VIBE_TAGS.find((v) => v.name === name)).filter(Boolean);
  const stats = {
    created: 0,
    joined: 0,
    reports: 0,
  };

  // Fetch user session stats
  useEffect(() => {
    if (!userId) return;
    supabase.from("sessions").select("id", { count: "exact", head: true }).eq("creator_id", userId).then(({ count }) => {
      stats.created = count || 0;
    });
    supabase.from("session_members").select("id", { count: "exact", head: true }).eq("user_id", userId).then(({ count }) => {
      stats.joined = count || 0;
    });
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("target_user_id", userId).then(({ count }) => {
      stats.reports = count || 0;
    });
  }, [userId]);

  const handleBan = async () => {
    if (!user) return;
    setLoading(true);
    // Ban = set reputation to 0
    await supabase.from("users").update({ reputation_score: 0 }).eq("id", user.id);
    setUser({ ...user, reputation_score: 0 });
    setLoading(false);
  };

  const handleUnban = async () => {
    if (!user) return;
    setLoading(true);
    await supabase.from("users").update({ reputation_score: 5.0 }).eq("id", user.id);
    setUser({ ...user, reputation_score: 5.0 });
    setLoading(false);
  };

  const handleReputation = async (delta: number) => {
    if (!user) return;
    const newScore = Math.max(0, Math.min(5, (user.reputation_score || 0) + delta));
    setLoading(true);
    await supabase.from("users").update({ reputation_score: newScore }).eq("id", user.id);
    setUser({ ...user, reputation_score: newScore });
    setLoading(false);
  };

  const score = user.reputation_score || 0;
  const scoreColor = score >= 4.0 ? "text-green-400" : score >= 3.0 ? "text-yellow-400" : "text-red-400";
  const scoreBg = score >= 4.0 ? "bg-green-500/10" : score >= 3.0 ? "bg-yellow-500/10" : "bg-red-500/10";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-gray-100">用户详情</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-5">
          {/* Identity */}
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold mx-auto">
              {(user.name || "?").slice(0, 1)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-100">{user.name || "未命名"}</h3>
              <p className="text-sm text-gray-500">{user.id?.slice(0, 12)}...</p>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${scoreBg} ${scoreColor}`}>
              <Star className="h-3.5 w-3.5" />
              信誉分 {score.toFixed(1)}
            </div>
          </div>

          {/* Info Fields (Read Only) */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <School className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-gray-300">{user.school || "未填写"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-gray-300">{user.grade || "未填写"} · {user.created_at ? new Date(user.created_at).toLocaleDateString("zh-CN") : "未知"}</span>
            </div>
          </div>

          {/* Bio (Read Only) */}
          {user.bio && (
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">个人简介</p>
              <p className="text-sm text-gray-300">{user.bio}</p>
            </div>
          )}

          {/* Tags (Read Only) */}
          {userTags.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Vibe 标签</p>
              <div className="flex flex-wrap gap-1.5">
                {userTags.map((t: any) => (
                  <span key={t.name} className="text-xs bg-gray-900 text-gray-300 px-2 py-1 rounded-full">{t.emoji} {t.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-900 rounded-xl p-3"><p className="text-lg font-bold text-gray-100">{stats.created}</p><p className="text-[10px] text-gray-500">发起的局</p></div>
            <div className="bg-gray-900 rounded-xl p-3"><p className="text-lg font-bold text-gray-100">{stats.joined}</p><p className="text-[10px] text-gray-500">参加的局</p></div>
            <div className="bg-gray-900 rounded-xl p-3"><p className="text-lg font-bold text-red-400">{stats.reports}</p><p className="text-[10px] text-gray-500">被举报</p></div>
          </div>

          {/* Reputation Adjustment */}
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">调整信誉分</p>
            <div className="flex items-center gap-2">
              <button onClick={() => handleReputation(-0.5)} disabled={loading || score <= 0} className="h-9 w-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center disabled:opacity-30"><Minus className="h-4 w-4" /></button>
              <div className={`flex-1 text-center font-bold text-lg ${scoreColor}`}>{score.toFixed(1)}</div>
              <button onClick={() => handleReputation(+0.5)} disabled={loading || score >= 5} className="h-9 w-9 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 flex items-center justify-center disabled:opacity-30"><Plus className="h-4 w-4" /></button>
            </div>
            <input placeholder="调整原因（必填）" value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full h-8 px-3 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500" />
          </div>

          {/* Ban / Unban */}
          <div className="space-y-2">
            {score > 2.0 ? (
              <button onClick={handleBan} disabled={loading}
                className="w-full h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <ShieldOff className="h-4 w-4" /> 封禁用户
              </button>
            ) : (
              <button onClick={handleUnban} disabled={loading}
                className="w-full h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                <Shield className="h-4 w-4" /> 解封用户
              </button>
            )}
            <p className="text-[10px] text-gray-600 text-center">封禁将信誉分清零，解封恢复至 5.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
