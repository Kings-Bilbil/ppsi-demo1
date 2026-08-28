export const STATUSES = ["Perencanaan", "Sedang Proses", "Siap Diambil", "Selesai"] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_STYLES: Record<Status, { badge: string; bar: string }> = {
  Perencanaan: { badge: "bg-amber-100 text-amber-700 ring-amber-200", bar: "bg-amber-400" },
  "Sedang Proses": { badge: "bg-blue-100 text-blue-700 ring-blue-200", bar: "bg-blue-500" },
  "Siap Diambil": { badge: "bg-orange-100 text-orange-700 ring-orange-200", bar: "bg-orange-400" },
  Selesai: { badge: "bg-emerald-100 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500" },
};

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

export const INVALID_CODE_MESSAGE = "Kode tidak valid atau pesanan telah selesai.";
