"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { CityProvider } from "@/lib/city-context";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <CityProvider>
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">{children}</main>
        <BottomNav />
      </CityProvider>
    </AuthProvider>
  );
}
