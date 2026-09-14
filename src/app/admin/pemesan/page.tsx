"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, copyText } from "@/lib/client";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { Order, Stock } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  Spinner,
  useToast,
} from "@/components/ui";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/icons";

// Common classes for dark theme
const btnPrimary = "inline-flex items-center gap-2 rounded-lg bg-[#B4F105] px-4 py-2 text-sm font-semibold text-[#051C12] transition hover:bg-amber-400 disabled:opacity-60";
const btnGhost = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#6C7E75] transition hover:bg-[#E9EFEF] hover:text-[#0B130F] disabled:opacity-60";
const inputCls = "w-full rounded-lg border border-[#E9EFEF] bg-white px-4 py-2.5 text-sm text-[#0B130F] placeholder:text-[#879A91] focus:border-[#B4F105] focus:outline-none focus:ring-1 focus:ring-[#B4F105] transition-colors";

interface FormState {
  buyerName: string;
  stockId: string;
  quantity: string;
  description: string;
  paymentStatus: string;
  amountPaid: string;
}

const EMPTY_FORM: FormState = {
  buyerName: "",
  stockId: "",
  quantity: "",
  description: "",
  paymentStatus: "Belum DP",
  amountPaid: "",
};

const PAYMENT_STATUSES = ["Belum DP", "Sudah DP", "Lunas"];

const getPaymentBadge = (status: string) => {
  switch (status) {
    case "Lunas": return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
    case "Sudah DP": return "bg-[#B4F105]/10 text-[#072F1F] ring-[#B4F105]/20";
    default: return "bg-red-500/10 text-red-500 ring-red-500/20";
  }
};

const getOrderStatusBadge = (status: string) => {
  if (status === "Selesai") return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
  if (status === "Perencanaan") return "bg-neutral-500/10 text-[#6C7E75] ring-neutral-500/20";
  return "bg-blue-500/10 text-blue-400 ring-blue-500/20";
};

export default function DataPemesanPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { show, node: toastNode } = useToast();

  const load = useCallback(async (isPoll = false) => {
    try {
      const [ordersRes, stocksRes] = await Promise.all([
        api<Order[]>("/api/orders"),
        api<Stock[]>("/api/stock"),
      ]);
      setOrders(ordersRes);
      setStocks(stocksRes);
    } catch (e) {
      if (!isPoll && e instanceof Error) show(e.message, "error");
    }
  }, [show]);

  useEffect(() => {
    void load(false);
  }, [load]);

  usePolling(() => void load(true), 30000);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingId(order.id);
    setForm({
      buyerName: order.buyerName,
      stockId: order.stockId ?? "",
      quantity: String(order.quantity),
      description: order.description ?? "",
      paymentStatus: order.paymentStatus || "Belum DP",
      amountPaid: String(order.amountPaid || 0),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const payload = JSON.stringify({
        buyerName: form.buyerName,
        stockId: form.stockId,
        quantity: Number(form.quantity),
        description: form.description,
        paymentStatus: form.paymentStatus,
        amountPaid: Number(form.amountPaid) || 0,
      });
      
      if (editingId) {
        await api(`/api/orders/${editingId}`, { method: "PUT", body: payload });
        show("Data pemesan berhasil diperbarui.");
        setFormOpen(false);
        void load();
      } else {
        const created = await api<Order>("/api/orders", { method: "POST", body: payload });
        setFormOpen(false);
        setCreatedCode(created.purchaseCode);
        void load();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/orders/${deleteTarget.id}`, { method: "DELETE" });
      show("Data pemesan dihapus permanen.");
      setDeleteTarget(null);
      void load();
    } catch (e) {
      show(e instanceof Error ? e.message : "Gagal menghapus.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const copyCreatedCode = async () => {
    if (!createdCode) return;
    if (await copyText(createdCode)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {toastNode}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-wide text-[#0B130F]">Data Pemesan</h1>
          <p className="mt-1 text-sm text-[#6C7E75]">Kelola seluruh pesanan dan status pembayarannya.</p>
        </div>
        <button onClick={openAdd} className={btnPrimary} disabled={stocks.length === 0}>
          <PlusIcon className="h-4 w-4" /> Tambah Pesanan
        </button>
      </div>

      {stocks.length === 0 && orders !== null && (
        <div className="rounded-xl border border-[#B4F105]/30 bg-[#B4F105]/10 px-4 py-3 text-sm text-[#072F1F]">
          Tambahkan minimal satu jenis baju di menu Kelola Stok sebelum membuat pesanan.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E9EFEF] bg-white backdrop-blur-xl shadow-xl">
        {orders === null ? (
          <div className="flex items-center justify-center py-24 text-[#879A91]">
            <Spinner className="h-7 w-7 text-[#072F1F]" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-10 w-10 text-[#072F1F]/50" />}
            title="Belum ada data pemesan"
            subtitle="Klik 'Tambah Pesanan' untuk mencatat pesanan pertama."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E9EFEF] text-sm">
              <thead>
                <tr className="bg-[#F4F6F5] text-left text-xs font-semibold uppercase tracking-wider text-[#879A91]">
                  <th className="px-5 py-4">Pembeli</th>
                  <th className="px-5 py-4">Pesanan</th>
                  <th className="px-5 py-4">Total & DP</th>
                  <th className="px-5 py-4">Status Pesanan</th>
                  <th className="px-5 py-4">Pembayaran</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EFEF]">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#F4F6F5]">
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#0B130F]">{order.buyerName}</div>
                      <div className="text-[10px] tracking-widest text-[#879A91] mt-1 uppercase">{order.purchaseCode}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#6C7E75]">{order.stockName}</div>
                      <div className="text-xs text-[#879A91]">{order.quantity} pcs</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#072F1F]">{formatIDR(order.totalPrice)}</div>
                      <div className="text-xs text-[#6C7E75] mt-0.5">DP: {formatIDR(order.amountPaid || 0)}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getOrderStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getPaymentBadge(order.paymentStatus || "Belum DP")}`}>
                        {order.paymentStatus || "Belum DP"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setDetail(order)}
                          title="Lihat Detail"
                          className="rounded-lg p-2 text-[#879A91] transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(order)}
                          title="Edit"
                          className="rounded-lg p-2 text-[#879A91] transition-colors hover:bg-[#B4F105]/10 hover:text-[#072F1F]"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(order)}
                          title="Hapus"
                          className="rounded-lg p-2 text-[#879A91] transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal tambah/edit */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit Pesanan" : "Tambah Pesanan Baru"}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="buyer-name" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
              Nama Pembeli
            </label>
            <input
              id="buyer-name"
              value={form.buyerName}
              onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
              placeholder="Nama lengkap pembeli"
              className={inputCls}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label htmlFor="stock-select" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
              Jenis Baju
            </label>
            <select
              id="stock-select"
              value={form.stockId}
              onChange={(e) => setForm((f) => ({ ...f, stockId: e.target.value }))}
              className={inputCls}
              required
            >
              <option value="" disabled>Pilih jenis baju</option>
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (stok: {s.quantity} • {formatIDR(s.unitPrice)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qty" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
                Jumlah (pcs)
              </label>
              <input
                id="qty"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                placeholder="1"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
                Total Harga
              </label>
              <div className="flex h-[42px] items-center rounded-lg border border-[#E9EFEF] bg-white px-3 text-sm font-semibold text-[#072F1F]">
                {(() => {
                  const st = stocks.find((s) => s.id === form.stockId);
                  const qty = Number(form.quantity);
                  if (!st || !qty || qty < 1) return "-";
                  return formatIDR(st.unitPrice * qty);
                })()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentStatus" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
                Status Bayar
              </label>
              <select
                id="paymentStatus"
                value={form.paymentStatus}
                onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
                className={inputCls}
              >
                {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="amountPaid" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
                Uang Diterima (Rp)
              </label>
              <input
                id="amountPaid"
                type="number"
                min={0}
                value={form.amountPaid}
                onChange={(e) => setForm((f) => ({ ...f, amountPaid: e.target.value }))}
                placeholder="0"
                className={inputCls}
                disabled={form.paymentStatus === "Belum DP"}
              />
              {form.paymentStatus === "Lunas" && (
                <button 
                  type="button" 
                  onClick={() => {
                    const st = stocks.find((s) => s.id === form.stockId);
                    const qty = Number(form.quantity);
                    if (st && qty) setForm(f => ({ ...f, amountPaid: String(st.unitPrice * qty) }));
                  }}
                  className="mt-1 text-[10px] text-[#072F1F] hover:underline"
                >
                  Set Penuh
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="mb-1.5 block text-xs font-medium tracking-wide text-[#6C7E75] uppercase">
              Deskripsi <span className="font-normal text-neutral-600">(opsional)</span>
            </label>
            <textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Catatan ukuran, warna, dsb."
              rows={2}
              maxLength={1000}
              className={`${inputCls} resize-none`}
            />
          </div>

          {!editingId && (
            <p className="rounded-lg bg-blue-500/10 px-3 py-2 text-[11px] text-blue-400 border border-blue-500/20">
              Kode pembelian untuk tracking klien dibuat otomatis.
            </p>
          )}

          {formError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className={btnGhost}>
              Batal
            </button>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving && <Spinner className="h-4 w-4" />}
              {editingId ? "Simpan Perubahan" : "Simpan Pesanan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Popup kode pembelian */}
      <Modal open={createdCode !== null} onClose={() => setCreatedCode(null)} title="Pesanan Berhasil">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckIcon className="h-7 w-7" />
          </span>
          <p className="mt-5 text-sm text-[#6C7E75]">Kode pelacakan pesanan:</p>
          <p className="mt-3 rounded-xl bg-[#F4F6F5] border border-[#E9EFEF] px-4 py-4 font-mono text-3xl font-bold tracking-[0.35em] text-[#072F1F] select-all">
            {createdCode}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[#879A91]">
            Berikan kode ini kepada pembeli untuk melacak status pesanan secara mandiri di halaman depan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={copyCreatedCode} className={btnGhost}>
              {copied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
              {copied ? "Tersalin!" : "Salin Kode"}
            </button>
            <button onClick={() => setCreatedCode(null)} className={btnPrimary}>
              Selesai
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail pesanan */}
      <Modal open={detail !== null} onClose={() => setDetail(null)} title="Detail Pemesanan">
        {detail && (
          <dl className="space-y-4 text-sm">
            {[
              ["Nama Pembeli", detail.buyerName],
              ["Jenis Baju", `${detail.stockName} (${detail.quantity} pcs)`],
              ["Status Pekerjaan", <span key="1" className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getOrderStatusBadge(detail.status)}`}>{detail.status}</span>],
              ["Status Bayar", <span key="2" className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${getPaymentBadge(detail.paymentStatus || "Belum DP")}`}>{detail.paymentStatus || "Belum DP"}</span>],
              ["Total Harga", formatIDR(detail.totalPrice)],
              ["Uang Masuk", formatIDR(detail.amountPaid || 0)],
              ["Sisa Tagihan", formatIDR(detail.totalPrice - (detail.amountPaid || 0))],
              ["Kode Tracking", <span key="3" className="font-mono tracking-widest text-[#072F1F] select-all">{detail.purchaseCode}</span>],
              ["Waktu Order", formatDateTime(detail.createdAt)],
              ["Catatan", detail.description || "-"],
            ].map(([label, value], i) => (
              <div key={i} className="flex items-start justify-between gap-6 border-b border-[#E9EFEF] pb-3 last:border-0">
                <dt className="shrink-0 text-[#879A91] text-xs uppercase tracking-wide mt-0.5">{label}</dt>
                <dd className="text-right font-medium text-[#0B130F]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus data pemesan?"
        tone="danger"
        message={
          deleteTarget && (
            <span className="text-[#6C7E75]">
              Data atas nama <strong className="text-[#0B130F]">{deleteTarget.buyerName}</strong> akan
              dihapus permanen.
            </span>
          )
        }
      />
    </div>
  );
}
