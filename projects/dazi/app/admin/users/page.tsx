"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/data-table";
import { UserDetailSheet } from "@/components/admin/user-detail-sheet";
import { Avatar } from "@/components/ui/avatar";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error: err } = await supabase.from("users").select("*").eq("is_admin", false).order("created_at", { ascending: false });
        if (err) { setError(err.message); return; }
        setUsers(data || []);
      } catch (e: any) { setError(e.message || ""); }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let list = [...users];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((u) => (u.name || "").toLowerCase().includes(s) || (u.school || "").toLowerCase().includes(s));
    }
    list.sort((a, b) => {
      const va = a[sortKey] ?? "", vb = b[sortKey] ?? "";
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, search, sortKey, sortDir]);

  const columns = [
    { key: "name", header: "用户", render: (r: any) => (
      <button onClick={() => setSelectedUserId(r.id)} className="flex items-center gap-2.5 hover:opacity-80">
        <Avatar name={r.name || "?"} size="sm" />
        <span className="text-gray-200 font-medium text-sm">{r.name || "-"}</span>
      </button>
    )},
    { key: "school", header: "学校", render: (r: any) => <span className="text-gray-400 text-sm">{r.school || "-"}</span> },
    { key: "reputation_score", header: "信誉分", sortable: true, render: (r: any) => {
      const s = Number(r.reputation_score ?? 5);
      return <span className={`text-xs font-medium ${s >= 4 ? "text-green-400" : s >= 3 ? "text-yellow-400" : "text-red-400"}`}>{s.toFixed(1)}</span>;
    }},
    { key: "created_at", header: "注册时间", sortable: true, render: (r: any) => <span className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString("zh-CN") : "-"}</span> },
    { key: "status", header: "状态", render: (r: any) => (Number(r.reputation_score ?? 5) < 2
      ? <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">已封禁</span>
      : <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">正常</span>
    )},
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div><h1 className="text-xl font-bold text-gray-100">用户管理</h1><p className="text-sm text-gray-500 mt-0.5">{users.length} 个普通用户 · 点用户名查看详情</p></div>
      {error ? <p className="text-red-400 text-sm py-10 text-center">{error}</p> : (
        <DataTable
          columns={columns}
          data={filtered}
          searchPlaceholder="搜索昵称或学校..."
          searchValue={search}
          onSearchChange={setSearch}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={(k) => { if (k === sortKey) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } }}
          emptyMessage="暂无普通用户"
        />
      )}
      <UserDetailSheet userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
}
