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
  { href: "/admin", label: "Home", icon: HomeIcon },
  { href: "/admin/stok", label: "Kelola Stok", icon: BoxIcon },
  { href: "/admin/pemesan", label: "Data Pemesan", icon: UsersIcon },
  { href: "/admin/riwayat", label: "Riwayat Pemesanan", icon: ClockIcon },
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
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#b98a2f] to-[#96701f] text-white">
          <NeedleLogo className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-slate-900">Arunika Tailor</p>
          <p className="text-[11px] text-slate-400">Panel Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-[#1a73e8]" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-sm font-semibold text-white">
            {username.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium capitalize text-slate-800">{username}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        >
          <LogoutIcon className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-slate-200 bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <span className="font-display text-base font-semibold text-slate-900">Arunika Tailor</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-xs font-semibold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
      </header>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <XIcon className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
