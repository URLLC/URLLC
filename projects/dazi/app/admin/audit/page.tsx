"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { MOCK_AUDITS } from "@/lib/admin-mock";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_AUDITS.filter((a) => !search || a.sessionTitle.includes(search) || a.creatorName.includes(search));

  const columns = [
    { key: "sessionTitle", header: "局标题", render: (r: any) => <span className="max-w-xs truncate block">{r.sessionTitle}</span> },
    { key: "creatorName", header: "发起人" },
    { key: "result", header: "审核结果", render: (r: any) => {
      const labels: Record<string, string> = { auto_pass: "✅ 自动通过", auto_block: "🚫 自动拦截", manual_pass: "✅ 人工通过", manual_block: "🚫 人工拦截" };
      const cls = r.result.includes("block") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20";
      return <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls}`}>{labels[r.result] || r.result}</span>;
    }},
    { key: "matchedWords", header: "命中词", render: (r: any) => <span className="text-xs text-gray-500">{r.matchedWords?.join(", ") || "-"}</span> },
    { key: "createdAt", header: "时间", render: (r: any) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString("zh-CN")}</span> },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">审核流水</h1>
        <p className="text-sm text-gray-500 mt-0.5">所有内容审核记录。AI 审核接口已预留。</p>
      </div>
      <DataTable columns={columns} data={filtered} searchPlaceholder="搜索标题或发起人..." searchValue={search} onSearchChange={setSearch} />
    </div>
  );
}
