"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/data-table";
import { formatTime } from "@/lib/utils";
import { CITIES } from "@/lib/mock-data";
import { Pin, PinOff, Trash2, Download } from "lucide-react";

export default function SessionsManagement() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    supabase.from("sessions").select("*, creator:users!sessions_creator_id_fkey(name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSessions(data);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = [...sessions];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((r) => r.title?.toLowerCase().includes(s) || r.creator?.name?.toLowerCase().includes(s));
    }
    if (cityFilter !== "all") list = list.filter((r) => r.city === cityFilter);
    list.sort((a, b) => {
      const va = a[sortKey] ?? "", vb = b[sortKey] ?? "";
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [sessions, search, cityFilter, sortKey, sortDir]);

  const togglePin = async (id: string, current: boolean) => {
    await supabase.from("sessions").update({ is_pinned: !current }).eq("id", id);
    setSessions((p) => p.map((s) => s.id === id ? { ...s, is_pinned: !current } : s));
  };

  const deleteSession = async (id: string) => {
    await supabase.from("sessions").delete().eq("id", id);
    setSessions((p) => p.filter((s) => s.id !== id));
  };

  const columns = [
    { key: "title", header: "标题", render: (r: any) => <span className="max-w-xs truncate block">{r.title}</span> },
    { key: "city", header: "城市", render: (r: any) => CITIES.find((c) => c.id === r.city)?.name || r.city },
    { key: "creator", header: "发起人", render: (r: any) => r.creator?.name || "-" },
    { key: "start_time", header: "时间", sortable: true, render: (r: any) => <span className="text-xs text-gray-400">{formatTime(r.start_time)}</span> },
    { key: "status", header: "状态", render: (r: any) => r.is_pinned ? <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">已置顶</span> : <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">正常</span> },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">局管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} 个局</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="h-9 px-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:outline-none focus:border-purple-500">
          <option value="all">全部城市</option>
          {CITIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <button onClick={() => {
          const csv = "标题,城市,状态,人数,创建时间\n" + filtered.map((s) => `"${s.title}","${CITIES.find((c) => c.id === s.city)?.name || s.city}","${s.status}",${s.max_people},"${new Date(s.created_at).toLocaleDateString("zh-CN")}"`).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "dazi-sessions.csv"; a.click();
        }} className="h-9 px-3 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> 导出CSV
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="搜索标题或发起人..."
        searchValue={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(k) => { if (k === sortKey) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } }}
        actions={(r: any) => (
          <div className="flex items-center gap-1.5">
            <button onClick={() => togglePin(r.id, r.is_pinned)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-purple-400"><Pin className="h-3.5 w-3.5" /></button>
            <button onClick={() => deleteSession(r.id)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        )}
      />
    </div>
  );
}
