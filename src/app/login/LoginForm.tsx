"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/client";
import { Spinner } from "@/components/ui";
import { NeedleLogo } from "@/components/GarmentArt";

const inputCls = "w-full rounded-lg border border-[#E9EFEF] bg-[#F4F6F5] px-4 py-2.5 text-sm text-[#0B130F] placeholder:text-[#879A91] focus:border-[#B4F105] focus:outline-none focus:ring-1 focus:ring-[#B4F105] transition-colors";

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
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6F5] px-4 font-sans selection:bg-[#B4F105]/30">
      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#051C12] text-[#B4F105] shadow-sm">
            <NeedleLogo className="h-7 w-7" />
          </span>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-wide text-[#051C12]">SPARK ARUNIKA</h1>
            <p className="text-xs tracking-widest text-[#6C7E75] uppercase mt-1">Admin Portal</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[#E9EFEF] bg-white p-7 shadow-xl"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
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
              <label htmlFor="password" className="mb-2 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
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
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#B4F105] px-4 py-3 text-sm font-semibold text-[#051C12] transition-all hover:bg-[#c1f824] disabled:opacity-60"
          >
            {loading ? <Spinner className="h-5 w-5" /> : "Masuk ke Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#879A91]">
          Demo: username <span className="font-mono text-[#051C12] font-semibold">admin</span> / password{" "}
          <span className="font-mono text-[#051C12] font-semibold">admin123</span>
        </p>
      </div>
    </div>
  );
}
