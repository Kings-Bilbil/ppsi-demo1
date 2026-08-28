"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STATUSES, type Status } from "@/lib/constants";
import { api } from "@/lib/client";
import { Badge, Spinner, btnPrimary, inputCls } from "./ui";
import { formatDateTime, formatIDR } from "@/lib/format";
import { RefreshIcon, SearchIcon } from "./icons";

export default function CheckStatusForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [detail, setDetail] = useState<null | { buyerName: string; stockName: string; quantity: number; totalPrice: number; description: string | null; purchaseCode: string; createdAt: string; updatedAt: string; status: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async (silent: boolean) => {
    if (!silent) setLoading(true);
    try {
      const res = await api<{ status: string; buyerName: string; stockName: string; quantity: number; totalPrice: number; description: string | null; purchaseCode: string; createdAt: string; updatedAt: string }>("/api/check-status", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setStatus(res.status as Status);
      setDetail(res as unknown as typeof detail);
      setError(null);
      setCheckedAt(new Date());
    } catch (e) {
      setStatus(null);
      setDetail(null);
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      setCheckedAt(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);
    if (!/^[A-Za-z]{6}$/.test(code.trim())) {
      setStatus(null);
      setDetail(null);
      setError("Masukkan kode pembelian 6 huruf.");
      setCheckedAt(null);
      return;
    }
    void check(false).then(() => {
      timerRef.current = setInterval(() => {
        if (document.visibilityState === "visible") void check(true);
      }, 15000);
    });
  };

  const currentIndex = status ? STATUSES.indexOf(status) : -1;

  return (
    <div className="mx-auto w-full max-w-xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Contoh: kR7mQw"
          maxLength={6}
          aria-label="Kode pembelian"
          className={`${inputCls} flex-1 text-center font-mono text-lg tracking-[0.35em] sm:text-left sm:tracking-[0.3em]`}
        />
        <button type="submit" disabled={loading} className={`${btnPrimary} px-6 py-2.5`}>
          {loading ? <Spinner className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
          Cek Status
        </button>
      </form>

      <div aria-live="polite" className="mt-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {status && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-500">Status pesanan Anda</span>
              <Badge status={status} />
            </div>

            <ol className="mt-6 flex items-start">
              {STATUSES.map((s, i) => {
                const done = i <= currentIndex;
                const isLast = i === STATUSES.length - 1;
                return (
                  <li key={s} className={`flex ${isLast ? "" : "flex-1"} flex-col items-center`}>
                    <div className="flex w-full items-center">
                      <span
                        className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                          done
                            ? "border-[#b98a2f] bg-[#b98a2f] text-white"
                            : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {!isLast && (
                        <span
                          className={`mx-1 h-0.5 flex-1 rounded ${
                            i < currentIndex ? "bg-[#b98a2f]" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`mt-2 px-1 text-center text-[11px] leading-tight sm:text-xs ${
                        done ? "font-semibold text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>

            {detail && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <h4 className="mb-3 font-semibold text-slate-900">Detail Pesanan</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Nama</dt><dd className="font-medium text-slate-900">{detail.buyerName}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Jenis Baju</dt><dd className="font-medium text-slate-900">{detail.stockName}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Jumlah</dt><dd className="font-medium text-slate-900">{detail.quantity} pcs</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Total Harga</dt><dd className="font-semibold text-slate-900">{formatIDR(detail.totalPrice)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Kode</dt><dd className="font-mono font-medium text-slate-900">{detail.purchaseCode}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-slate-500">Tanggal Pesan</dt><dd className="font-medium text-slate-900">{formatDateTime(detail.createdAt)}</dd></div>
                  {detail.description && <div className="pt-2 border-t border-slate-200"><dt className="text-slate-500 text-xs">Deskripsi</dt><dd className="mt-1 text-slate-700">{detail.description}</dd></div>}
                </dl>
              </div>
            )}

            <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
              <RefreshIcon className="h-3.5 w-3.5" />
              Halaman diperbarui otomatis tiap 15 detik
              {checkedAt && ` • dicek pukul ${checkedAt.toLocaleTimeString("id-ID")}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
