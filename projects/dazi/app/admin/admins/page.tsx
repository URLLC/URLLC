"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/admin/data-table";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2, UserCog } from "lucide-react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);

  const loadAdmins = () => {
    supabase.from("users").select("*").eq("is_admin", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setAdmins(data);
    });
  };

  useEffect(() => { loadAdmins(); }, []);

  const removeAdmin = async (id: string) => {
    await supabase.from("users").update({ is_admin: false }).eq("id", id);
    loadAdmins();
  };

  const columns = [
    { key: "name", header: "管理员", render: (r: any) => (
      <div className="flex items-center gap-2.5"><Avatar name={r.name} size="sm" /><div><p className="text-gray-200 font-medium text-sm">{r.name}</p><p className="text-gray-500 text-[11px]">{r.email || "-"}</p></div></div>
    )},
    { key: "created_at", header: "加入时间", render: (r: any) => <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString("zh-CN")}</span> },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-100">管理员管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">{admins.length} 个管理员</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        emptyMessage="暂无管理员"
        actions={(r: any) => (
          <button onClick={() => removeAdmin(r.id)} className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors" title="取消管理员权限">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      />

      {/* Note: To ADD new admins, use the Accounts page or manual SQL */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2"><UserCog className="h-4 w-4 text-purple-400" /><span className="text-sm font-medium text-gray-300">添加管理员</span></div>
        <p className="text-xs text-gray-500 leading-relaxed">
          新管理员账户需要先在前台注册为普通用户，然后由超级管理员在此页面通过 SQL 或 API 将其 <code className="text-purple-400 bg-gray-800 px-1 py-0.5 rounded">is_admin</code> 设为 <code className="text-green-400 bg-gray-800 px-1 py-0.5 rounded">true</code>。
          或通过「账号管理」页面创建新用户后在数据库中将 is_admin 标记设为 true。
        </p>
      </div>
    </div>
  );
}
