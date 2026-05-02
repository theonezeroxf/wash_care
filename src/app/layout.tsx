import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://universal-care.example"),
  title: {
    default: "Universal Care | 通用洗护预约平台",
    template: "%s | Universal Care",
  },
  description:
    "一个基于 Next.js、Prisma、Supabase 与 Vercel 的通用洗护预约平台 MVP。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#020617] text-slate-50">
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_45%)]" />
          <header className="sticky top-0 z-20 border-b border-white/8 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
              <Link
                className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200"
                href="/"
              >
                Universal Care
              </Link>
              <nav className="flex items-center gap-5 text-sm text-slate-300">
                <Link className="transition hover:text-white" href="/services">
                  服务与价格
                </Link>
                <Link className="transition hover:text-white" href="/book">
                  预约下单
                </Link>
                <Link className="transition hover:text-white" href="/admin/orders">
                  管理后台
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative flex flex-1 flex-col">{children}</main>
          <footer className="border-t border-white/8 bg-slate-950/70">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <p>Universal Care MVP · Next.js App Router + Prisma + Supabase + Vercel</p>
              <p>当前可先使用本地示例数据，接入 `DATABASE_URL` 后自动切换到数据库。</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
