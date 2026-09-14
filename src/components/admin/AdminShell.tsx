"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { api } from "@/lib/client";
import {
  BoxIcon,
  ClockIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons";
import { NeedleLogo } from "@/components/GarmentArt";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/stok", label: "Kelola Stok", icon: BoxIcon },
  { href: "/admin/pemesan", label: "Data Pemesan", icon: UsersIcon },
  { href: "/admin/riwayat", label: "Riwayat", icon: ClockIcon },
];

export default function AdminShell({ username, children }: { username: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#051C12] text-white">
      {/* Brand */}
      <div className="flex h-[80px] items-center gap-3 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#B4F105] text-[#051C12]">
          <NeedleLogo className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-wide text-white">Spark Arunika</span>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#879A91]">Menu</div>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#1A3E30] text-white shadow-sm"
                    : "text-[#879A91] hover:bg-[#1A3E30]/50 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#B4F105]" : "text-[#879A91]"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#072F1F] p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A3E30] text-sm font-semibold text-[#B4F105]">
            {username.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white capitalize">{username}</p>
            <p className="text-xs text-[#879A91]">Administrator</p>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            title="Keluar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F5] font-sans text-[#0B130F] selection:bg-[#B4F105]/30">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] lg:block">
        {sidebarContent}
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#E9EFEF] bg-white px-4 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
          className="rounded-lg p-2 text-[#0B130F] hover:bg-[#F4F6F5]"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <span className="font-display text-base font-bold tracking-wide text-[#051C12]">Spark Arunika</span>
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#B4F105] text-xs font-semibold text-[#051C12]">
          {username.charAt(0).toUpperCase()}
        </span>
      </header>

      {/* Topbar Desktop (Optional extra matching) */}
      <header className="hidden h-[80px] items-center justify-between border-b border-[#E9EFEF] bg-white px-8 lg:flex lg:ml-[280px]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Search anything in Spark..." className="w-80 rounded-full border border-[#E9EFEF] bg-[#F4F6F5] px-5 py-2.5 text-sm text-[#0B130F] placeholder-[#6C7E75] focus:border-[#B4F105] focus:outline-none focus:ring-1 focus:ring-[#B4F105] transition-all" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-[#E9EFEF] pl-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3E30] text-sm font-semibold text-[#B4F105]">
              {username.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-bold text-[#0B130F] capitalize">{username}</span>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#051C12]/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85%] flex-col bg-[#051C12] shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-4 top-5 rounded-lg p-1.5 text-[#879A91] hover:bg-[#1A3E30]"
            >
              <XIcon className="h-6 w-6" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="lg:pl-[280px]">
        <div className="mx-auto max-w-7xl p-4 md:p-8 lg:px-8 lg:py-6">{children}</div>
      </main>
    </div>
  );
}
