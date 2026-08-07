"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) router.replace("/"); });
  }, [router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    if (mode === "register") {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(), password,
        options: { data: { name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (authError) { setError(authError.message); return; }
      if (!data.session) { setMessage("账号已创建，请前往邮箱完成验证后再登录。"); return; }
      router.replace("/");
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (authError) { setError("邮箱或密码不正确，请重试。"); return; }
    router.replace("/");
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden lg:block"><span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700"><Sparkles className="h-3.5 w-3.5" /> Dazi · 海外留学生轻社交</span><h1 className="mt-5 text-5xl font-black leading-[1.08] tracking-[-.05em] text-gray-950">一起生活，<br /><span className="text-purple-600">比独自适应更轻松。</span></h1><p className="mt-5 max-w-md leading-7 text-gray-500">不必先找“完美匹配”。从一顿饭、一次自习、一次出游开始，认识和你同频的人。</p><div className="mt-10 grid max-w-md grid-cols-3 gap-3">{[["🍜","饭搭子"],["📚","学习局"],["🚶","周末出游"]].map(([emoji,label]) => <div key={label} className="rounded-2xl bg-white p-4 text-center shadow-sm"><span className="text-2xl">{emoji}</span><p className="mt-2 text-xs font-semibold text-gray-700">{label}</p></div>)}</div></section>
      <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_24px_70px_rgba(47,36,94,.12)] sm:p-8"><div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white"><Sparkles className="h-4 w-4" /></span><span className="text-xl font-black tracking-tight">Dazi<span className="text-purple-500">.</span></span></div><div className="mt-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-purple-500">Welcome</p><h2 className="mt-2 text-2xl font-black text-gray-950">{mode === "login" ? "欢迎回来" : "创建你的账号"}</h2><p className="mt-1 text-sm text-gray-500">{mode === "login" ? "继续看看附近有什么有趣的计划。" : "用邮箱创建账号，开始发起你的第一个活动。"}</p></div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === "register" && <label className="block"><span className="mb-1.5 block text-xs font-medium text-gray-500">昵称</span><div className="relative"><UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="大家怎么称呼你？" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100" /></div></label>}
          <label className="block"><span className="mb-1.5 block text-xs font-medium text-gray-500">邮箱</span><div className="relative"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100" /></div></label>
          <label className="block"><span className="mb-1.5 block text-xs font-medium text-gray-500">密码</span><div className="relative"><LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 6 位" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-10 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" aria-label={showPassword ? "隐藏密码" : "显示密码"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}{message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{message}</p>}
          <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-bold text-white transition hover:bg-purple-600 disabled:opacity-50">{loading ? "请稍候…" : mode === "login" ? "登录" : "创建账号"}<ArrowRight className="h-4 w-4" /></button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">{mode === "login" ? "还没有账号？" : "已经有账号？"}<button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }} className="ml-1 font-semibold text-purple-600 hover:text-purple-700">{mode === "login" ? "现在注册" : "直接登录"}</button></p><p className="mt-7 text-center text-[11px] leading-5 text-gray-400">继续即表示你同意以尊重、友善的方式参与 Dazi 社区。</p>
      </section>
    </div>
  );
}
