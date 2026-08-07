import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminAuthGuard } from "@/components/admin/auth-guard";

export const metadata: Metadata = {
  title: "搭子后台",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
