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
import { CheckIcon } from "@/components/icons";
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
  const [expandedCols, setExpandedCols] = useState<Record<string, boolean>>({});
  
  const { show, node: toastNode } = useToast();

  const toggleExpand = (status: string) => {
    setExpandedCols(prev => ({ ...prev, [status]: !prev[status] }));
  };

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

  useEffect(() => {
    void load(false);
  }, [load]);

  const draggingRef = usePolling(() => void load(true), 30000);

  const columns = useMemo(() => {
    const map = new Map<Status, Order[]>(STATUSES.map((s) => [s, []]));
    for (const o of orders ?? []) {
      const col = map.get(o.status as Status);
      if (col && o.status !== "Selesai") col.push(o);
    }
    return map;
  }, [orders]);

  // Calculations
  const totalStok = stocks.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPemesananAktif = orders?.length || 0;
  
  const totalBelumDP = orders?.filter(o => o.paymentStatus === "Belum DP").length || 0;
  const totalSudahDP = orders?.filter(o => o.paymentStatus === "Sudah DP").length || 0;
  const totalLunas = orders?.filter(o => o.paymentStatus === "Lunas").length || 0;

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
    <div className="space-y-8 pb-10">
      {toastNode}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-wide text-[#0B130F]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6C7E75]">Pantau performa bisnis, stok, dan alur pesanan secara real-time.</p>
        </div>
      </div>

      {/* TOP AREA: Quick Info Stat Cards (Spark Admin Style) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Alert Card */}
        <div className="relative overflow-hidden rounded-[20px] bg-[#072F1F] p-6 shadow-md text-white">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <span className="inline-block rounded-full bg-[#1A3E30] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#B4F105]">
                Pesanan Aktif
              </span>
              <div className="mt-4 text-5xl font-display font-bold tracking-tight">{totalPemesananAktif}</div>
              <div className="mt-2 font-medium text-[#879A91]">Pesanan sedang dalam proses produksi.</div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#B4F105]">
              <span>Kelola Pesanan</span>
              <span className="text-lg">→</span>
            </div>
          </div>
          {/* Background shape mimicking Spark Admin asterik/star */}
          <svg className="absolute -right-8 -top-8 z-0 h-40 w-40 text-[#B4F105]/20" viewBox="0 0 100 100" fill="currentColor">
            <g transform="translate(50,50)">
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" />
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" transform="rotate(60)" />
              <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" transform="rotate(120)" />
            </g>
          </svg>
        </div>

        {/* Total Stock */}
        <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E9EFEF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7E75]">Total Stok Tersedia</span>
            <div className="mt-3 text-4xl font-display font-bold text-[#0B130F]">{totalStok} <span className="text-lg text-[#6C7E75]">pcs</span></div>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
              Lacak di Kelola Stok
            </span>
          </div>
        </div>

        {/* Total Completed */}
        <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E9EFEF] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7E75]">Pesanan Selesai</span>
            <div className="mt-3 text-4xl font-display font-bold text-[#0B130F]">{completedCount} <span className="text-lg text-[#6C7E75]">trx</span></div>
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1.5 text-xs font-medium text-[#22C55E]">
              Riwayat Transaksi
            </span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6C7E75]">Ringkasan Keuangan</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatTile label="Total Modal Produksi" value={formatIDR(totalModal)} accentColor="text-[#EF4444]" />
          <StatTile label="Proyeksi Pendapatan" value={formatIDR(totalRevenue)} accentColor="text-blue-600" />
          <StatTile label="Proyeksi Keuntungan" value={formatIDR(totalProfit)} accentColor="text-[#22C55E]" />
          <StatTile label="Saldo Kas (Masuk)" value={formatIDR(currentBalance)} accentColor="text-[#F97316]" highlight />
        </div>
      </div>

      {/* Kanban (Moved here as requested: under financials) */}
      <section className="mt-8 border-t border-[#E9EFEF] pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold tracking-wide text-[#0B130F]">Papan Alur Produksi (Kanban)</h2>
          <p className="hidden text-xs tracking-wider text-[#6C7E75] uppercase sm:block">
            Tarik kartu antar kolom untuk mengubah status
          </p>
        </div>

        {orders === null ? (
          <div className="flex items-center justify-center rounded-[20px] border border-[#E9EFEF] bg-white py-32 text-[#879A91] shadow-sm">
            <Spinner className="h-8 w-8 text-[#B4F105]" />
          </div>
        ) : (
          <DragDropContext
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 gap-5 overflow-x-auto pb-4 md:grid-cols-4 md:[&>*]:min-w-[260px] lg:[&>*]:min-w-[280px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {STATUSES.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex min-h-[300px] flex-col rounded-[20px] p-4 transition-colors ${
                        snapshot.isDraggingOver ? "bg-[#B4F105]/10 border border-[#B4F105]/30" : "bg-white border border-[#E9EFEF] shadow-sm"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].bar.replace('bg-', 'bg-')}`} />
                          <h3 className="text-sm font-bold tracking-wide text-[#0B130F]">{status}</h3>
                        </div>
                        <span className="rounded-full bg-[#F4F6F5] px-2.5 py-0.5 text-xs font-semibold text-[#6C7E75] ring-1 ring-inset ring-[#E9EFEF]">
                          {columns.get(status)?.length ?? 0}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-3">
                        {(() => {
                          const allItems = columns.get(status) ?? [];
                          const isExpanded = expandedCols[status] || false;
                          const displayedItems = isExpanded ? allItems : allItems.slice(0, 4);
                          const hiddenCount = allItems.length - displayedItems.length;

                          return (
                            <>
                              {displayedItems.map((order, index) => {
                                const isMutating = mutatingOrderId === order.id;
                                return (
                                  <Draggable draggableId={order.id} index={index} key={order.id}>
                                    {(dragProvided, dragSnapshot) => (
                                      <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                        className={`relative rounded-xl border border-[#E9EFEF] bg-[#F4F6F5] p-4 transition-all ${
                                          dragSnapshot.isDragging
                                            ? "cursor-grabbing shadow-[0_10px_30px_rgba(11,19,15,0.15)] ring-1 ring-[#B4F105]"
                                            : "cursor-grab hover:border-[#B4F105]/50 hover:shadow-md"
                                        }`}
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <p className="truncate pr-2 text-sm font-bold text-[#0B130F]">
                                            {order.buyerName}
                                          </p>
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getPaymentBadge(order.paymentStatus || "Belum DP")}`}>
                                            {order.paymentStatus || "Belum DP"}
                                          </span>
                                        </div>
                                        
                                        <p className="text-xs text-[#6C7E75]">
                                          {order.stockName} • <span className="text-[#0B130F] font-semibold">{order.quantity} pcs</span>
                                        </p>
                                        <p className="mt-2 text-sm font-bold tracking-wide text-[#072F1F]">
                                          {formatIDR(order.totalPrice)}
                                        </p>
                                        
                                        <p className="mt-3 inline-block rounded-md bg-white px-2 py-1 font-mono text-[10px] tracking-widest text-[#879A91] border border-[#E9EFEF] select-all">
                                          {order.purchaseCode}
                                        </p>

                                        <div className="mt-4 md:hidden">
                                          <select
                                            value={order.status}
                                            onChange={(e) => onMobileStatusChange(order, e.target.value)}
                                            className="w-full rounded-lg border border-[#E9EFEF] bg-white px-2 py-1.5 text-xs text-[#0B130F] focus:border-[#B4F105] focus:outline-none focus:ring-1 focus:ring-[#B4F105]"
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

                              {hiddenCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(status)}
                                  className="mt-2 w-full rounded-xl border border-[#E9EFEF] bg-white py-2.5 text-xs font-bold text-[#6C7E75] shadow-sm hover:bg-[#F4F6F5] hover:text-[#0B130F] transition-colors"
                                >
                                  Lihat {hiddenCount} pesanan lainnya ↓
                                </button>
                              )}
                              
                              {isExpanded && allItems.length > 4 && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(status)}
                                  className="mt-2 w-full rounded-xl border border-[#E9EFEF] bg-white py-2.5 text-xs font-bold text-[#6C7E75] shadow-sm hover:bg-[#F4F6F5] hover:text-[#0B130F] transition-colors"
                                >
                                  Sembunyikan ↑
                                </button>
                              )}

                              {allItems.length === 0 && !snapshot.isDraggingOver && (
                                <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-[#E9EFEF] p-4">
                                  <p className="text-center text-xs text-[#879A91]">
                                    {status === "Selesai" ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <CheckIcon className="h-4 w-4" /> Letakkan di sini
                                      </span>
                                    ) : (
                                      "Kosong"
                                    )}
                                  </p>
                                </div>
                              )}
                            </>
                          );
                        })()}
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
        <div className="border border-[#E9EFEF] bg-white rounded-[20px] shadow-sm">
          <EmptyState
            title="Belum ada pesanan aktif"
            subtitle="Tambahkan pesanan baru melalui menu Data Pemesan."
          />
        </div>
      )}

      {/* Charts & Details Section (Moved under Kanban) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 pt-6 border-t border-[#E9EFEF]">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-[20px] border border-[#E9EFEF] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#0B130F] mb-6 uppercase tracking-wider">Perbandingan Modal vs Pendapatan</h2>
            {orders && stocks ? <FinancialBarChart orders={orders} stocks={stocks} /> : <div className="h-72 flex items-center justify-center"><Spinner className="w-6 h-6 text-[#B4F105]" /></div>}
          </div>

          <div className="rounded-[20px] border border-[#E9EFEF] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0B130F] uppercase tracking-wider">Ketersediaan Stok per Barang</h2>
            </div>
            {stocks.length === 0 ? (
              <p className="text-sm text-[#879A91] py-4">Belum ada data stok.</p>
            ) : (
              <div className="space-y-5">
                {stocks.map(stock => {
                  const maxEstim = Math.max(100, stock.quantity + 20); 
                  const percent = Math.min(100, Math.round((stock.quantity / maxEstim) * 100));
                  return (
                    <div key={stock.id}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-[#6C7E75]">{stock.name}</span>
                        <span className="font-bold text-[#0B130F]">{stock.quantity} pcs</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F6F5]">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${stock.quantity <= 5 ? "bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]" : "bg-[#B4F105]"}`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] border border-[#E9EFEF] bg-white p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-[#0B130F] mb-6 uppercase tracking-wider">Statistik Status Pembayaran</h2>
            {orders ? <PaymentStatusPieChart orders={orders} /> : <div className="h-[250px] flex items-center justify-center"><Spinner className="w-6 h-6 text-[#B4F105]" /></div>}
            
            <div className="mt-8 space-y-4 border-t border-[#E9EFEF] pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#22C55E]"></span>
                  <span className="text-sm font-medium text-[#6C7E75]">Lunas</span>
                </div>
                <span className="text-base font-bold text-[#0B130F]">{totalLunas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#F97316]"></span>
                  <span className="text-sm font-medium text-[#6C7E75]">Sudah DP</span>
                </div>
                <span className="text-base font-bold text-[#0B130F]">{totalSudahDP}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]"></span>
                  <span className="text-sm font-medium text-[#6C7E75]">Belum DP</span>
                </div>
                <span className="text-base font-bold text-[#0B130F]">{totalBelumDP}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] bg-[#DCFCE7]/50 p-6 text-center border border-[#DCFCE7]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#22C55E] mb-2">Perhatian</p>
            <p className="text-sm text-[#072F1F] leading-relaxed">
              Pastikan Anda mengupdate status pada papan pesanan secara berkala agar pelanggan mendapatkan informasi terkini.
            </p>
          </div>
        </div>
      </div>

      {mutatingOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051C12]/40 backdrop-blur-sm">
          <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-6 shadow-2xl">
            <Spinner className="mb-4 h-10 w-10 text-[#B4F105]" />
            <p className="font-semibold text-[#0B130F]">Memperbarui Status...</p>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingComplete !== null}
        onCancel={() => setPendingComplete(null)}
        onConfirm={() => pendingComplete && handleSelesai(pendingComplete)}
        title="Selesaikan Pesanan?"
        tone="success"
        confirmText="Ya, Selesaikan"
        cancelText="Batal"
        loading={confirmLoading}
        message={
          pendingComplete && (
            <span className="text-[#6C7E75]">
              Pesanan <strong className="text-[#0B130F]">{pendingComplete.buyerName}</strong> akan dipindahkan ke Riwayat Pemesanan.
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
      className={`rounded-[20px] border p-5 transition-shadow ${
        highlight 
          ? "border-[#B4F105]/50 bg-[#B4F105]/10 shadow-sm hover:shadow-md" 
          : "border-[#E9EFEF] bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#879A91]">{label}</p>
      <p className={`mt-2.5 text-2xl font-display font-bold tracking-wide ${accentColor}`}>
        {value}
      </p>
    </div>
  );
}

