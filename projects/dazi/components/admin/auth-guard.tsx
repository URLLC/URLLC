"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") { setAllowed(true); return; }

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/admin/login"); return; }
        const { data: profile } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single();
        if (!profile?.is_admin) { await supabase.auth.signOut(); router.push("/admin/login"); return; }
        setAllowed(true);
      } catch (e: any) {
        setError(e.message || "认证失败");
      }
    })();
  }, [router, pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-950"><p className="text-red-400 text-sm">{error}</p></div>;
  }

  if (!allowed) {
    return <div className="flex items-center justify-center h-screen bg-gray-950"><div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" /></div>;
  }

  return <>{children}</>;
}
