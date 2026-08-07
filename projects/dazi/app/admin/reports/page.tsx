"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Ban, Check, Flag, Trash2 } from "lucide-react";

export default function ReportsCenter() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = () => {
    supabase.from("reports").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setReports(data || []); setLoading(false); });
  };

  const handleAction = async (id: string, action: "ignored" | "deleted" | "banned") => {
    await supabase.from("reports").update({ status: `resolved_${action}` }).eq("id", id);
    fetchReports();
  };

  const pending = reports.filter((r) => r.status === "pending");

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">举报中心</h1>
        <p className="text-sm text-gray-500 mt-0.5">真实数据 · {pending.length} 条待处理</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600 text-center py-8">加载中...</p>
      ) : (
        <>
          {pending.map((r) => (
            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2"><Flag className="h-4 w-4 text-red-400" /><span className="text-xs font-medium text-red-400 uppercase tracking-wider">待处理</span></div>
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  <p className="text-sm text-gray-400">原因：{r.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>被举报人：{r.target_user_id?.slice(0, 8)}...</span>
                    <span>{new Date(r.created_at).toLocaleString("zh-CN")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => handleAction(r.id, "ignored")} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-gray-800 text-xs text-gray-400 hover:bg-gray-700"><Check className="h-3.5 w-3.5" /> 忽略</button>
                  <button onClick={() => handleAction(r.id, "deleted")} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-orange-500/10 text-xs text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"><Trash2 className="h-3.5 w-3.5" /> 删除局</button>
                  <button onClick={() => handleAction(r.id, "banned")} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-red-500/10 text-xs text-red-400 border border-red-500/20 hover:bg-red-500/20"><Ban className="h-3.5 w-3.5" /> 封禁用户</button>
                </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && <p className="text-sm text-gray-600 text-center py-10">暂无举报记录</p>}
        </>
      )}
    </div>
  );
}
