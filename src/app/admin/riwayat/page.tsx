"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { Order } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import { EmptyState, Spinner } from "@/components/ui";
import { ClockIcon, HistoryIcon } from "@/components/icons";

export default function RiwayatPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  const load = useCallback(async () => {
    try {
      setOrders(await api<Order[]>("/api/orders/history"));
    } catch {
      setOrders((prev) => prev);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  usePolling(load, 30000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Riwayat Pemesanan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Daftar pesanan yang telah selesai, diurutkan dari yang terbaru.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {orders === null ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Spinner className="h-7 w-7" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon className="h-10 w-10" />}
            title="Belum ada pesanan selesai"
            subtitle="Pesanan yang diselesaikan di papan Home akan muncul di sini."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Nama Pembeli</th>
                  <th className="px-5 py-3">Jenis Baju</th>
                  <th className="px-5 py-3">Jumlah</th>
                  <th className="px-5 py-3">Total Harga</th>
                  <th className="px-5 py-3">Tanggal Selesai</th>
                  <th className="px-5 py-3">Kode Pembelian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{order.buyerName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{order.stockName}</td>
                    <td className="px-5 py-3.5 text-slate-600">{order.quantity} pcs</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {formatIDR(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                        {formatDateTime(order.completedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex flex-col gap-0.5">
                        <span className="font-mono text-xs tracking-wider text-slate-400 line-through select-all">
                          {order.purchaseCode}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wide text-red-400">
                          Tidak berlaku
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
