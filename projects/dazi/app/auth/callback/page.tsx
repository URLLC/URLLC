"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: err }) => {
      if (err || !session) { setError("验证失败，请重试"); return; }

      // Check if user has a password set
      const isNewUser = !session.user.last_sign_in_at ||
        new Date(session.user.created_at).getTime() === new Date(session.user.last_sign_in_at).getTime();

      if (isNewUser) {
        // New user: redirect to set password
        router.push(`/login?step=set-password&email=${encodeURIComponent(session.user.email || "")}`);
      } else {
        // Existing user: go to home
        router.push("/");
      }
    });
  }, [router]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-red-500">{error}</p>
        <a href="/login" className="text-purple-500 text-sm mt-3 inline-block">返回登录</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      <p className="text-gray-500 mt-3">验证中...</p>
    </div>
  );
}
