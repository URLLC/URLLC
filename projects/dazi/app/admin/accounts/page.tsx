"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus } from "lucide-react";

export default function AccountsPage() {
  const [emails, setEmails] = useState("");
  const [password, setPassword] = useState("dazi2026");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ email: string; status: string }[]>([]);

  const emailList = emails.split(/[\n,]+/).map((e) => e.trim()).filter((e) => e.includes("@"));

  const handleCreate = async () => {
    if (emailList.length === 0) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setLoading(false); return; }

    const res = await fetch("/api/admin/create-users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ emails: emailList, password }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const exportCSV = () => {
    const csv = "email,password,status\n" + results.map((r) => `${r.email},${password},${r.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dazi-test-accounts.csv"; a.click();
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">账号管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">批量创建内测账号 · 普通用户（非管理员）</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">创建账号</p>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">邮箱列表（一行一个）</label>
            <textarea
              value={emails} onChange={(e) => setEmails(e.target.value)}
              placeholder={"test1@anu.edu.au\ntest2@anu.edu.au"}
              className="w-full h-32 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
            <p className="text-[10px] text-gray-600 mt-1">{emailList.length} 个邮箱</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">统一初始密码</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className="bg-gray-800 border-gray-700 text-gray-200" />
          </div>
          <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={handleCreate} disabled={loading || emailList.length === 0}>
            {loading ? "创建中..." : `创建 ${emailList.length} 个账号`} <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">创建结果</p>
          {results.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">还没有创建记录</p>
          ) : (
            <>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${r.status === "创建成功" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    <span>{r.email}</span><span>{r.status}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-400 hover:bg-gray-800" onClick={exportCSV}>
                <Download className="h-3.5 w-3.5" /> 导出 CSV（含密码）
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
