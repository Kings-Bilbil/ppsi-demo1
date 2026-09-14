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
    <div className="flex h-full flex-col text-neutral-100">
      <div className="flex h-16 items-center gap-2.5 border-b border-neutral-800 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950">
          <NeedleLogo className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold tracking-wide text-amber-500">ARUNIKA</p>
          <p className="text-[10px] uppercase tracking-wider text-neutral-500">Tailor Dashboard</p>
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-amber-500" : "text-neutral-500"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-amber-500 ring-1 ring-neutral-700">
            {username.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium capitalize text-neutral-200">{username}</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-red-950/30 hover:text-red-500 disabled:opacity-60"
        >
          <LogoutIcon className="h-5 w-5" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-amber-500/30">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-neutral-800 bg-neutral-900/50 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <span className="font-display text-sm font-semibold tracking-wide text-amber-500">ARUNIKA</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-amber-500 ring-1 ring-neutral-700">
          {username.charAt(0).toUpperCase()}
        </span>
      </header>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-neutral-900 shadow-2xl ring-1 ring-white/10">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800"
            >
              <XIcon className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl p-4 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
