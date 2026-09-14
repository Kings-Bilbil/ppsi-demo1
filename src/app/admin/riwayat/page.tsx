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
        <h1 className="text-2xl font-display font-semibold tracking-wide text-[#0B130F]">Riwayat Pemesanan</h1>
        <p className="mt-1 text-sm text-[#6C7E75]">
          Daftar pesanan yang telah selesai, diurutkan dari yang terbaru.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9EFEF] bg-white backdrop-blur-xl shadow-xl">
        {orders === null ? (
          <div className="flex items-center justify-center py-24 text-[#879A91]">
            <Spinner className="h-7 w-7 text-[#072F1F]" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon className="h-10 w-10 text-[#072F1F]/50" />}
            title="Belum ada pesanan selesai"
            subtitle="Pesanan yang diselesaikan di papan Home akan muncul di sini."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E9EFEF] text-sm">
              <thead>
                <tr className="bg-[#F4F6F5] text-left text-xs font-semibold uppercase tracking-wider text-[#879A91]">
                  <th className="px-5 py-4">Nama Pembeli</th>
                  <th className="px-5 py-4">Jenis Baju</th>
                  <th className="px-5 py-4">Jumlah</th>
                  <th className="px-5 py-4">Total Harga</th>
                  <th className="px-5 py-4">Uang Masuk</th>
                  <th className="px-5 py-4">Tanggal Selesai</th>
                  <th className="px-5 py-4">Kode Pembelian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EFEF]">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#F4F6F5]">
                    <td className="px-5 py-4 font-medium text-[#0B130F]">{order.buyerName}</td>
                    <td className="px-5 py-4 text-[#6C7E75]">{order.stockName}</td>
                    <td className="px-5 py-4 text-[#6C7E75]">{order.quantity} pcs</td>
                    <td className="px-5 py-4 font-medium text-[#072F1F]">
                      {formatIDR(order.totalPrice)}
                    </td>
                    <td className="px-5 py-4 font-medium text-emerald-500">
                      {formatIDR(order.amountPaid || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[#6C7E75] text-xs">
                        <ClockIcon className="h-3.5 w-3.5 text-[#879A91]" />
                        {formatDateTime(order.completedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex flex-col gap-0.5">
                        <span className="font-mono text-xs tracking-wider text-neutral-600 line-through select-all">
                          {order.purchaseCode}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-widest text-red-500/80">
                          Selesai
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
