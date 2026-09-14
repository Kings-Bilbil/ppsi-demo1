"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/client";
import { Spinner } from "@/components/ui";
import { NeedleLogo } from "@/components/GarmentArt";
import { cn } from "@/lib/utils";

const inputCls = "w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 font-sans selection:bg-amber-500/30">
      {/* Decorative background element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-neutral-950 to-neutral-950"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <NeedleLogo className="h-7 w-7" />
          </span>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-wide text-amber-500">ARUNIKA</h1>
            <p className="text-xs tracking-widest text-neutral-500 uppercase mt-1">Admin Portal</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-7 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-medium tracking-wide text-neutral-400 uppercase">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium tracking-wide text-neutral-400 uppercase">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-neutral-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-60 disabled:hover:shadow-none"
          >
            {loading ? <Spinner className="h-5 w-5" /> : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Demo: username <span className="font-mono text-amber-500/80">admin</span> / password{" "}
          <span className="font-mono text-amber-500/80">admin123</span>
        </p>
      </div>
    </div>
  );
}
