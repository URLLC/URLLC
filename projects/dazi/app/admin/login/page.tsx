"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldAlert, ArrowRight, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: profile } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single();
      if (profile?.is_admin) router.push("/admin");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !password) return;
    setLoading(true); setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) { setError("账号或密码错误"); setLoading(false); return; }
    if (!authData.user) { setError("登录失败"); setLoading(false); return; }

    const { data: profile } = await supabase.from("users").select("is_admin").eq("id", authData.user.id).single();
    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setError("此账号没有管理员权限");
      setLoading(false);
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
            <ShieldAlert className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">搭子后台</h1>
          <p className="text-sm text-gray-500">仅限管理员登录</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email" placeholder="管理员邮箱" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                autoFocus
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password" placeholder="管理员密码" value={password} onChange={(e) => setPassword(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-700 bg-gray-800 pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-400/10 p-2.5 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading || !email.includes("@") || !password}
            className="w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? "验证中..." : "登录后台"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
