"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api, copyText } from "@/lib/client";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { Order, Stock } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  Modal,
  Spinner,
  btnGhost,
  btnPrimary,
  inputCls,
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

interface FormState {
  buyerName: string;
  stockId: string;
  quantity: string;
  totalPrice: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  buyerName: "",
  stockId: "",
  quantity: "",
  totalPrice: "",
  description: "",
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
      totalPrice: String(order.totalPrice),
      description: order.description ?? "",
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
          <h1 className="text-xl font-semibold text-slate-900">Data Pemesan</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola seluruh pesanan yang sedang berjalan.</p>
        </div>
        <button onClick={openAdd} className={btnPrimary} disabled={stocks.length === 0}>
          <PlusIcon className="h-4 w-4" /> Tambah Data Pemesan
        </button>
      </div>

      {stocks.length === 0 && orders !== null && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Tambahkan minimal satu jenis baju di menu Kelola Stok sebelum membuat pesanan.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {orders === null ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Spinner className="h-7 w-7" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-10 w-10" />}
            title="Belum ada data pemesan"
            subtitle="Klik 'Tambah Data Pemesan' untuk mencatat pesanan pertama."
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
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Kode</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
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
                      <Badge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs tracking-wider text-slate-600 select-all">
                        {order.purchaseCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setDetail(order)}
                          aria-label={`Lihat detail ${order.buyerName}`}
                          title="Lihat Detail"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#1a73e8]"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(order)}
                          aria-label={`Edit ${order.buyerName}`}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(order)}
                          aria-label={`Hapus ${order.buyerName}`}
                          title="Hapus"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
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
        title={editingId ? "Edit Data Pemesan" : "Tambah Data Pemesan"}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="buyer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
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
            <label htmlFor="stock-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Jenis Baju
            </label>
            <select
              id="stock-select"
              value={form.stockId}
              onChange={(e) => setForm((f) => ({ ...f, stockId: e.target.value }))}
              className={inputCls}
              required
            >
              <option value="" disabled>
                Pilih jenis baju
              </option>
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (stok: {s.quantity} • {formatIDR(s.unitPrice)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qty" className="mb-1.5 block text-sm font-medium text-slate-700">
                Jumlah
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Total Harga
              </label>
              <div className="flex h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900">
                {(() => {
                  const st = stocks.find((s) => s.id === form.stockId);
                  const qty = Number(form.quantity);
                  if (!st || !qty || qty < 1) return "-";
                  return formatIDR(st.unitPrice * qty);
                })()}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {(() => {
                  const st = stocks.find((s) => s.id === form.stockId);
                  if (!st) return "Pilih jenis baju dahulu";
                  return "Harga satuan " + formatIDR(st.unitPrice) + " x jumlah";
                })()}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-slate-700">
              Deskripsi <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Catatan ukuran, model, warna, dsb."
              rows={3}
              maxLength={1000}
              className={`${inputCls} resize-none`}
            />
          </div>

          {!editingId && (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Kode pembelian unik akan dibuat otomatis setelah data disimpan.
            </p>
          )}

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
      <Modal open={createdCode !== null} onClose={() => setCreatedCode(null)} title="Pesanan Berhasil Dibuat">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm text-slate-600">Kode pembelian untuk pesanan ini:</p>
          <p className="mt-3 rounded-xl bg-slate-100 px-4 py-4 font-mono text-4xl font-bold tracking-[0.35em] text-slate-900 select-all">
            {createdCode}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Berikan kode ini kepada pembeli untuk mengecek status pesanan di halaman utama.
            Simpan baik-baik — kode hanya berlaku selama pesanan belum selesai.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={copyCreatedCode} className={btnGhost}>
              {copied ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : <CopyIcon className="h-4 w-4" />}
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
          <dl className="space-y-3 text-sm">
            {[
              ["Nama Pembeli", detail.buyerName],
              ["Jenis Baju", detail.stockName],
              ["Jumlah", `${detail.quantity} pcs`],
              ["Total Harga", formatIDR(detail.totalPrice)],
              ["Status", ""],
              ["Kode Pembelian", detail.purchaseCode],
              ["Dibuat", formatDateTime(detail.createdAt)],
              ["Diubah", formatDateTime(detail.updatedAt)],
              ["Deskripsi", detail.description || "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-6 border-b border-slate-100 pb-3 last:border-0">
                <dt className="shrink-0 text-slate-500">{label}</dt>
                <dd className="text-right font-medium text-slate-900">
                  {label === "Status" ? <Badge status={detail.status} /> : value}
                  {label === "Kode Pembelian" && (
                    <span className="block font-mono tracking-wider">{value}</span>
                  )}
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
        message={
          deleteTarget && (
            <span>
              Data atas nama <strong className="text-slate-900">{deleteTarget.buyerName}</strong> akan
              dihapus permanen dan <strong>tidak</strong> masuk ke riwayat pemesanan.
            </span>
          )
        }
      />
    </div>
  );
}
