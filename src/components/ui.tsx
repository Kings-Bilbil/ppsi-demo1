"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { STATUS_STYLES, type Status } from "@/lib/constants";
import { XIcon } from "./icons";

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:bg-slate-50 disabled:text-slate-400";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1765cc] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/40 disabled:cursor-not-allowed disabled:opacity-60";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-60";

export const btnSuccess =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-60";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status as Status] ?? {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.badge}`}
    >
      {status}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-modal-in`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  tone = "danger",
  loading = false,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "primary" | "success";
  loading?: boolean;
}) {
  const confirmCls = tone === "danger" ? btnDanger : tone === "success" ? btnSuccess : btnPrimary;
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <div className="text-sm leading-relaxed text-slate-600">{message}</div>
      <div className="mt-6 flex justify-end gap-2">
        <button className={btnGhost} onClick={onCancel} disabled={loading}>
          {cancelText}
        </button>
        <button className={confirmCls} onClick={onConfirm} disabled={loading}>
          {loading && <Spinner className="h-4 w-4" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon?: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {icon && <div className="text-slate-300">{icon}</div>}
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "error" } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (msg: string, tone: "success" | "error" = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, tone });
    timer.current = setTimeout(() => setToast(null), 3500);
  };

  const node = toast ? (
    <div className="fixed bottom-5 right-5 z-[70] max-w-xs animate-toast-in">
      <div
        className={`rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
          toast.tone === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        {toast.msg}
      </div>
    </div>
  ) : null;

  return { show, node };
}
