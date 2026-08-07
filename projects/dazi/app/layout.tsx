import type { Metadata, Viewport } from "next";
import { RootLayoutClient } from "@/components/root-layout-client";
import "./globals.css";

export const metadata: Metadata = {
  title: "搭子 Dazi — 找到你的饭搭子、学习搭子、逛街搭子",
  description: "帮助海外留学生快速找到能一起做某件事的人。场景驱动的轻社交平台。",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "搭子", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#7C5FFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-screen pb-20 md:pb-0">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
