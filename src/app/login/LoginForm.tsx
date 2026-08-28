"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/client";
import { Spinner, inputCls } from "@/components/ui";
import { NeedleLogo } from "@/components/GarmentArt";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#b98a2f] to-[#96701f] text-white shadow-md">
            <NeedleLogo className="h-6 w-6" />
          </span>
          <h1 className="font-display text-xl font-semibold text-slate-900">Arunika Tailor</h1>
          <p className="text-sm text-slate-500">Masuk ke dashboard admin</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
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

          <label htmlFor="password" className="mb-1.5 mt-4 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="Masukkan password"
            required
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a73e8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1765cc] disabled:opacity-60"
          >
            {loading && <Spinner className="h-4 w-4" />}
            Masuk
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo: username <span className="font-mono font-semibold text-slate-500">admin</span> / password{" "}
          <span className="font-mono font-semibold text-slate-500">admin123</span>
        </p>
      </div>
    </div>
  );
}
