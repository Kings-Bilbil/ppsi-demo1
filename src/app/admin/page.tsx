"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { STATUSES, STATUS_STYLES, type Status } from "@/lib/constants";
import { api } from "@/lib/client";
import { formatIDR } from "@/lib/format";
import type { Order, Stock } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import { ConfirmDialog, EmptyState, Spinner, useToast } from "@/components/ui";
import { BoxIcon, CheckIcon } from "@/components/icons";
import { FinancialBarChart, PaymentStatusPieChart } from "@/components/admin/AdminCharts";

// Mock helper to get the status badge style
const getPaymentBadge = (status: string) => {
  switch (status) {
    case "Lunas": return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
    case "Sudah DP": return "bg-amber-500/10 text-amber-500 ring-amber-500/20";
    default: return "bg-red-500/10 text-red-500 ring-red-500/20";
  }
};

export default function AdminHomePage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingComplete, setPendingComplete] = useState<Order | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [mutatingOrderId, setMutatingOrderId] = useState<string | null>(null);
  
  const { show, node: toastNode } = useToast();

  const load = useCallback(async (isPoll = false) => {
    try {
      const [ordersRes, stocksRes] = await Promise.all([
        api<Order[]>("/api/orders"),
        api<Stock[]>("/api/stock"),
      ]);
      setOrders(ordersRes);
      setStocks(stocksRes);
      if (!isPoll) {
        try {
          const historyRes = await api<Order[]>("/api/orders/history");
          setCompletedCount(historyRes.length);
        } catch {}
      }
    } catch (e) {
      if (!isPoll && e instanceof Error) show(e.message, "error");
    }
  }, [show]);

  const loadHistory = useCallback(async () => {
    try {
      const historyRes = await api<Order[]>("/api/orders/history");
      setCompletedCount(historyRes.length);
    } catch {}
  }, []);

  useEffect(() => {
    void load(false);
    void loadHistory();
  }, [load, loadHistory]);

  const draggingRef = usePolling(() => void load(true), 30000);
  usePolling(loadHistory, 60000);

  const columns = useMemo(() => {
    const map = new Map<Status, Order[]>(STATUSES.map((s) => [s, []]));
    for (const o of orders ?? []) {
      const col = map.get(o.status as Status);
      if (col && o.status !== "Selesai") col.push(o);
    }
    return map;
  }, [orders]);

  // Financial Calculations
  const { totalModal, totalRevenue, totalProfit, currentBalance } = useMemo(() => {
    if (!orders || !stocks) return { totalModal: 0, totalRevenue: 0, totalProfit: 0, currentBalance: 0 };
    
    let rev = 0;
    let modal = 0;
    let balance = 0;

    for (const order of orders) {
      rev += order.totalPrice;
      balance += order.amountPaid || 0;
      
      const stock = stocks.find(s => s.name === order.stockName);
      if (stock) {
        modal += (stock.costPrice || 0) * order.quantity;
      }
    }

    return {
      totalModal: modal,
      totalRevenue: rev,
      totalProfit: rev - modal,
      currentBalance: balance
    };
  }, [orders, stocks]);

  const updateStatus = useCallback(
    async (order: Order, status: Status) => {
      const prevStatus = order.status;
      setMutatingOrderId(order.id);
      
      // Optimistic update
      setOrders((prev) =>
        prev ? prev.map((o) => (o.id === order.id ? { ...o, status } : o)) : prev
      );
      
      try {
        await api(`/api/orders/${order.id}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        });
        show(`Pesanan ${order.buyerName} -> ${status}`);
      } catch (e) {
        // revert on failure
        setOrders((prev) =>
          prev ? prev.map((o) => (o.id === order.id ? { ...o, status: prevStatus } : o)) : prev
        );
        show(e instanceof Error ? e.message : "Gagal memperbarui status.", "error");
      } finally {
        setMutatingOrderId(null);
      }
    },
    [show]
  );

  const handleSelesai = useCallback(
    async (order: Order) => {
      setConfirmLoading(true);
      try {
        await api(`/api/orders/${order.id}`, {
          method: "PUT",
          body: JSON.stringify({ status: "Selesai" }),
        });
        setPendingComplete(null);
        setOrders((prev) => (prev ? prev.filter((o) => o.id !== order.id) : prev));
        setCompletedCount((c) => c + 1);
        show(`Pesanan ${order.buyerName} selesai & masuk riwayat.`);
      } catch (e) {
        show(e instanceof Error ? e.message : "Gagal menyelesaikan pesanan.", "error");
      } finally {
        setConfirmLoading(false);
      }
    },
    [show]
  );

  const onDragEnd = (result: DropResult) => {
    draggingRef.current = false;
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const order = orders?.find((o) => o.id === draggableId);
    if (!order) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const nextStatus = destination.droppableId as Status;
    if (nextStatus === "Selesai" || order.status === "Selesai") {
      setPendingComplete(order);
      return;
    }
    void updateStatus(order, nextStatus);
  };

  const onMobileStatusChange = (order: Order, value: string) => {
    if (value === "Selesai" || order.status === "Selesai") {
      setPendingComplete(order);
      return;
    }
    void updateStatus(order, value as Status);
  };

  return (
    <div className="space-y-8">
      {toastNode}

      <div>
        <h1 className="text-2xl font-display font-semibold tracking-wide text-neutral-100">Ringkasan Keuangan & Operasional</h1>
        <p className="mt-1 text-sm text-neutral-400">Pantau performa bisnis dan alur pesanan secara real-time.</p>
      </div>

      {/* Financial Stat tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Total Modal Produksi" value={formatIDR(totalModal)} accentColor="text-rose-500" />
        <StatTile label="Proyeksi Pendapatan" value={formatIDR(totalRevenue)} accentColor="text-blue-500" />
        <StatTile label="Proyeksi Keuntungan" value={formatIDR(totalProfit)} accentColor="text-emerald-500" />
        <StatTile label="Saldo Kas (Masuk)" value={formatIDR(currentBalance)} accentColor="text-amber-500" highlight />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-neutral-200 mb-6 uppercase tracking-wider">Perbandingan Modal vs Pendapatan</h2>
          {orders && stocks ? <FinancialBarChart orders={orders} stocks={stocks} /> : <div className="h-72 flex items-center justify-center"><Spinner className="w-6 h-6 text-amber-500" /></div>}
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-neutral-200 mb-6 uppercase tracking-wider">Status Pembayaran</h2>
          {orders ? <PaymentStatusPieChart orders={orders} /> : <div className="h-72 flex items-center justify-center"><Spinner className="w-6 h-6 text-amber-500" /></div>}
        </div>
      </div>

      {/* Kanban */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold tracking-wide text-neutral-100">Papan Pesanan (Kanban)</h2>
          <p className="hidden text-xs tracking-wider text-neutral-500 uppercase sm:block">
            Tarik kartu antar kolom untuk mengubah status
          </p>
        </div>

        {orders === null ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 py-32 text-neutral-400 shadow-sm">
            <Spinner className="h-8 w-8 text-amber-500" />
          </div>
        ) : (
          <DragDropContext
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 gap-5 overflow-x-auto pb-4 md:grid-cols-4 md:[&>*]:min-w-[260px] lg:[&>*]:min-w-[280px]">
              {STATUSES.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex min-h-[300px] flex-col rounded-2xl p-4 transition-colors ${
                        snapshot.isDraggingOver ? "bg-amber-500/5 border border-amber-500/20" : "bg-neutral-900/40 border border-neutral-800"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${STATUS_STYLES[status].bar.replace('bg-', 'bg-')}`} />
                          <h3 className="text-sm font-semibold tracking-wide text-neutral-200">{status}</h3>
                        </div>
                        <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-400 ring-1 ring-inset ring-neutral-700">
                          {columns.get(status)?.length ?? 0}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        {columns.get(status)?.map((order, index) => {
                          const isMutating = mutatingOrderId === order.id;
                          return (
                            <Draggable draggableId={order.id} index={index} key={order.id}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className={`relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all ${
                                    dragSnapshot.isDragging
                                      ? "cursor-grabbing shadow-[0_10px_30px_rgba(0,0,0,0.5)] ring-1 ring-amber-500/50"
                                      : "cursor-grab hover:border-neutral-700 hover:shadow-lg"
                                  } ${isMutating ? "opacity-50 grayscale pointer-events-none" : ""}`}
                                >
                                  {isMutating && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50 rounded-xl z-10 backdrop-blur-[1px]">
                                      <Spinner className="h-6 w-6 text-amber-500" />
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="truncate pr-2 text-sm font-semibold text-neutral-100">
                                      {order.buyerName}
                                    </p>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getPaymentBadge(order.paymentStatus)}`}>
                                      {order.paymentStatus || "Belum DP"}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs text-neutral-400">
                                    {order.stockName} • <span className="text-neutral-300">{order.quantity} pcs</span>
                                  </p>
                                  <p className="mt-2 text-sm font-semibold tracking-wide text-amber-500">
                                    {formatIDR(order.totalPrice)}
                                  </p>
                                  
                                  <p className="mt-3 inline-block rounded-md bg-neutral-900 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-500 select-all border border-neutral-800">
                                    {order.purchaseCode}
                                  </p>

                                  <div className="mt-4 md:hidden">
                                    <select
                                      value={order.status}
                                      onChange={(e) => onMobileStatusChange(order, e.target.value)}
                                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-300 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    >
                                      {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        {(columns.get(status)?.length ?? 0) === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-neutral-800/60 p-4">
                            <p className="text-center text-xs text-neutral-600">
                              {status === "Selesai" ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <CheckIcon className="h-4 w-4" /> Letakkan di sini untuk menyelesaikan
                                </span>
                              ) : (
                                "Tidak ada pesanan"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </section>

      {orders !== null && orders.length === 0 && (
        <div className="border border-neutral-800 bg-neutral-900/50 rounded-2xl">
          <EmptyState
            title="Belum ada pesanan aktif"
            subtitle="Tambahkan pesanan baru melalui menu Data Pemesan."
          />
        </div>
      )}

      <ConfirmDialog
        open={pendingComplete !== null}
        onCancel={() => setPendingComplete(null)}
        onConfirm={() => pendingComplete && handleSelesai(pendingComplete)}
        title="Selesaikan Pesanan?"
        tone="success"
        confirmText="Ya, Selesaikan"
        cancelText="Tidak"
        loading={confirmLoading}
        message={
          pendingComplete && (
            <span className="text-neutral-300">
              Pesanan atas nama <strong className="text-neutral-100">{pendingComplete.buyerName}</strong> akan dipindahkan ke Riwayat Pemesanan.
            </span>
          )
        }
      />
    </div>
  );
}

function StatTile({ label, value, accentColor, highlight = false }: { label: string; value: string; accentColor: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        highlight 
          ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
          : "border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-neutral-700"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className={`mt-2.5 text-2xl font-display font-semibold tracking-wide ${accentColor}`}>
        {value}
      </p>
    </div>
  );
}
