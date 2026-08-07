import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "服务端管理员配置缺失" }, { status: 503 });
  }

  // Auth check - only admin can call this
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!authHeader) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
  if (authError || !user) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "无权限" }, { status: 403 });

  // Get emails from request
  const { emails, password } = await request.json();
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "请提供邮箱列表" }, { status: 400 });
  }
  if (emails.length > 50) return NextResponse.json({ error: "单次最多创建 50 个账号" }, { status: 400 });
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
  }

  const results: { email: string; status: string }[] = [];
  const seen = new Set<string>();

  for (const email of emails) {
    const trimmed = String(email).trim().toLowerCase();
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      results.push({ email: trimmed, status: "格式错误" });
      continue;
    }
    try {
      const { error } = await supabase.auth.admin.createUser({
        email: trimmed,
        password,
        email_confirm: true,
        user_metadata: { name: trimmed.split("@")[0] },
      });
      if (error) {
        results.push({ email: trimmed, status: error.message });
      } else results.push({ email: trimmed, status: "创建成功" });
    } catch (e: any) {
      results.push({ email: trimmed, status: e.message || "未知错误" });
    }
  }

  return NextResponse.json({ results, total: results.length });
}
