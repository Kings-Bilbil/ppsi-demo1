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

export default function AdminHomePage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingComplete, setPendingComplete] = useState<Order | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
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

  const updateStatus = useCallback(
    async (order: Order, status: Status) => {
      const prevStatus = order.status;
      setOrders((prev) =>
        prev ? prev.map((o) => (o.id === order.id ? { ...o, status } : o)) : prev
      );
      try {
        await api(`/api/orders/${order.id}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        });
        show(`Status ${order.buyerName} -> ${status}`);
      } catch (e) {
        // revert on failure
        setOrders((prev) =>
          prev ? prev.map((o) => (o.id === order.id ? { ...o, status: prevStatus } : o)) : prev
        );
        show(e instanceof Error ? e.message : "Gagal memperbarui status.", "error");
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

  const totalUnits = stocks.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="space-y-6">
      {toastNode}

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Ringkasan</h1>
        <p className="mt-1 text-sm text-slate-500">Pantau stok dan alur pesanan secara real-time.</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Jenis Baju" value={String(stocks.length)} />
        <StatTile label="Total Unit Stok" value={String(totalUnits)} />
        <StatTile label="Pesanan Aktif" value={String(orders?.length ?? 0)} />
        <StatTile label="Pesanan Selesai" value={String(completedCount)} accent />
      </div>

      {/* Stock chips */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <BoxIcon className="h-4 w-4 text-[#1a73e8]" /> Stok per Jenis Baju
        </div>
        {stocks.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada data stok. Tambahkan di menu Kelola Stok.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {stocks.map((s) => (
              <span
                key={s.id}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  s.quantity <= 5
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {s.name}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    s.quantity <= 5 ? "bg-amber-200/70" : "bg-white ring-1 ring-inset ring-slate-200"
                  }`}
                >
                  {s.quantity}
                </span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Kanban */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Papan Pesanan</h2>
          <p className="hidden text-xs text-slate-400 sm:block">
            Tarik kartu antar kolom untuk mengubah status
          </p>
        </div>

        {orders === null ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-slate-400 shadow-sm">
            <Spinner className="h-7 w-7" />
          </div>
        ) : (
          <DragDropContext
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-4 md:[&>*]:min-w-[240px] lg:[&>*]:min-w-[260px]">
              {STATUSES.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex min-h-56 flex-col rounded-2xl p-3 transition-colors ${
                        snapshot.isDraggingOver ? "bg-[#e8f0fe]" : "bg-[#f1f3f4]"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].bar}`} />
                          <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
                        </div>
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                          {columns.get(status)?.length ?? 0}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        {columns.get(status)?.map((order, index) => (
                          <Draggable draggableId={order.id} index={index} key={order.id}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow ${
                                  dragSnapshot.isDragging
                                    ? "cursor-grabbing shadow-lg"
                                    : "cursor-grab hover:shadow-md"
                                }`}
                              >
                                <p className="truncate pr-2 text-sm font-semibold text-slate-900">
                                  {order.buyerName}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {order.stockName} • {order.quantity} pcs
                                </p>
                                <p className="mt-1.5 text-sm font-semibold text-[#1a73e8]">
                                  {formatIDR(order.totalPrice)}
                                </p>
                                <p className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs tracking-wider text-slate-600 select-all">
                                  {order.purchaseCode}
                                </p>

                                <div className="mt-3 md:hidden">
                                  <select
                                    value={order.status}
                                    onChange={(e) => onMobileStatusChange(order, e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
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
                        ))}
                        {provided.placeholder}

                        {(columns.get(status)?.length ?? 0) === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300/70 p-4">
                            <p className="text-center text-xs text-slate-400">
                              {status === "Selesai" ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <CheckIcon className="h-4 w-4" /> Letakkan kartu di sini untuk
                                  menyelesaikan
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
        <EmptyState
          title="Belum ada pesanan aktif"
          subtitle="Tambahkan pesanan baru melalui menu Data Pemesan."
        />
      )}

      <ConfirmDialog
        open={pendingComplete !== null}
        onCancel={() => setPendingComplete(null)}
        onConfirm={() => pendingComplete && handleSelesai(pendingComplete)}
        title="Apakah pesanan telah selesai?"
        tone="success"
        confirmText="Ya, Selesaikan"
        cancelText="Tidak"
        loading={confirmLoading}
        message={
          pendingComplete && (
            <span>
              Pesanan atas nama{" "}
              <strong className="text-slate-900">{pendingComplete.buyerName}</strong> akan dipindahkan ke
              Riwayat Pemesanan dan kode pembelian menjadi tidak berlaku.
            </span>
          )
        }
      />
    </div>
  );
}

function StatTile({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        accent ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent ? "text-emerald-700" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}
