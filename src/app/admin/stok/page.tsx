"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ApiError, api } from "@/lib/client";
import { formatDate, formatIDR } from "@/lib/format";
import type { Stock } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  Spinner,
  useToast,
} from "@/components/ui";
import { BoxIcon, PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";

// Common classes for dark theme buttons
const btnPrimary = "inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:opacity-60";
const btnGhost = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-60";
const btnDanger = "inline-flex items-center gap-2 rounded-lg bg-red-500/10 text-red-500 px-4 py-2 text-sm font-medium transition hover:bg-red-500 hover:text-white disabled:opacity-60";
const inputCls = "w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors";

export default function KelolaStokPage() {
  const [stocks, setStocks] = useState<Stock[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Stock | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Stock | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState<{ stock: Stock; orderCount: number; error: string } | null>(null);
  const [forceText, setForceText] = useState("");
  const [forceDeleting, setForceDeleting] = useState(false);
  const [showForceModal, setShowForceModal] = useState(false);
  const { show, node: toastNode } = useToast();

  const load = useCallback(async (isPoll = false) => {
    try {
      setStocks(await api<Stock[]>("/api/stock"));
    } catch (e) {
      if (!isPoll && e instanceof Error) show(e.message, "error");
    }
  }, [show]);

  useEffect(() => {
    void load(false);
  }, [load]);

  usePolling(() => void load(true), 30000);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setQuantity("");
    setUnitPrice("");
    setCostPrice("");
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (stock: Stock) => {
    setEditing(stock);
    setName(stock.name);
    setQuantity(String(stock.quantity));
    setUnitPrice(String(stock.unitPrice));
    setCostPrice(String(stock.costPrice || 0));
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Nama jenis baju wajib diisi.");
      return;
    }
    const priceNum = Number(unitPrice);
    if (!unitPrice || Number.isNaN(priceNum) || priceNum <= 0) {
      setFormError("Harga jual harus lebih dari 0.");
      return;
    }
    
    setSaving(true);
    try {
      const priceVal = unitPrice === "" ? undefined : Number(unitPrice);
      const costVal = costPrice === "" ? 0 : Number(costPrice);
      if (editing) {
        await api(`/api/stock/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: name.trim(), quantity: quantity === "" ? undefined : Number(quantity), unitPrice: priceVal, costPrice: costVal }),
        });
        show("Stok berhasil diperbarui.");
      } else {
        await api("/api/stock", {
          method: "POST",
          body: JSON.stringify({ name: name.trim(), quantity: Number(quantity), unitPrice: Number(unitPrice), costPrice: costVal }),
        });
        show("Jenis baju baru berhasil ditambahkan.");
      }
      setFormOpen(false);
      void load();
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
      await api(`/api/stock/${deleteTarget.id}`, { method: "DELETE" });
      show(`"${deleteTarget.name}" dihapus.`);
      setDeleteTarget(null);
      void load();
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 409 && err.requireForce) {
        setBlockedInfo({ stock: deleteTarget, orderCount: err.orderCount ?? 0, error: err.message });
        setDeleteTarget(null);
        setShowForceModal(false);
        setForceText("");
      } else {
        show(e instanceof Error ? e.message : "Gagal menghapus.", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  const confirmForceDelete = async () => {
    if (!blockedInfo) return;
    if (forceText !== "Hapus Stok") {
      show('Ketik "Hapus Stok" dengan tepat.', "error");
      return;
    }
    setForceDeleting(true);
    try {
      const res = await api<{ deletedOrders?: number }>(
        `/api/stock/${blockedInfo.stock.id}?force=true`,
        { method: "DELETE", body: JSON.stringify({ confirmText: "Hapus Stok" }) }
      );
      show(`"${blockedInfo.stock.name}" dan ${res.deletedOrders ?? blockedInfo.orderCount} pesanan terkait dihapus.`);
      setBlockedInfo(null);
      setShowForceModal(false);
      setForceText("");
      void load();
    } catch (e) {
      show(e instanceof Error ? e.message : "Gagal menghapus paksa.", "error");
    } finally {
      setForceDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastNode}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-wide text-neutral-100">Kelola Stok</h1>
          <p className="mt-1 text-sm text-neutral-400">Atur jenis baju, jumlah stok, harga modal, dan harga jual.</p>
        </div>
        <button onClick={openAdd} className={btnPrimary}>
          <PlusIcon className="h-4 w-4" /> Tambah Stok
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-xl">
        {stocks === null ? (
          <div className="flex items-center justify-center py-24 text-neutral-500">
            <Spinner className="h-7 w-7 text-amber-500" />
          </div>
        ) : stocks.length === 0 ? (
          <EmptyState
            icon={<BoxIcon className="h-10 w-10 text-amber-500/50" />}
            title="Belum ada jenis baju"
            subtitle="Klik 'Tambah Stok' untuk mulai mencatat stok."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800 text-sm">
              <thead>
                <tr className="bg-neutral-900 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-4">Nama Jenis Baju</th>
                  <th className="px-5 py-4">Jumlah Stok</th>
                  <th className="px-5 py-4">Harga Modal</th>
                  <th className="px-5 py-4">Harga Jual</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="transition-colors hover:bg-neutral-800/30">
                    <td className="px-5 py-4 font-medium text-neutral-200">{stock.name}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex min-w-[2rem] justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          stock.quantity <= 5
                            ? "bg-red-500/10 text-red-500 ring-red-500/20"
                            : "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                        }`}
                      >
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-rose-500">{formatIDR(stock.costPrice || 0)}</td>
                    <td className="px-5 py-4 font-medium text-emerald-500">{formatIDR(stock.unitPrice)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(stock)}
                          aria-label={`Edit ${stock.name}`}
                          title="Edit"
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-amber-500/10 hover:text-amber-500"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(stock)}
                          aria-label={`Hapus ${stock.name}`}
                          title="Hapus"
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
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
        title={editing ? "Edit Jenis Baju" : "Tambah Stok Baru"}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="nama-baju" className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-neutral-400">
              Nama Jenis Baju
            </label>
            <input
              id="nama-baju"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kemeja Formal"
              className={inputCls}
              maxLength={80}
              required
            />
          </div>
          <div>
            <label htmlFor="jumlah-stok" className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-neutral-400">
              Jumlah Stok
            </label>
            <input
              id="jumlah-stok"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className={inputCls}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="harga-modal" className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-neutral-400">
                Harga Modal (Rp)
              </label>
              <input
                id="harga-modal"
                type="number"
                min={0}
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="50000"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="harga-jual" className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-neutral-400">
                Harga Jual (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="harga-jual"
                type="number"
                min={0.01}
                step="any"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="75000"
                className={inputCls}
                required
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Harga jual harus lebih dari 0. Nama produk tidak boleh sama.</p>

          {formError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setFormOpen(false)} className={btnGhost}>
              Batal
            </button>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving && <Spinner className="h-4 w-4" />}
              {editing ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus jenis baju?"
        tone="danger"
        message={
          deleteTarget && (
            <span className="text-neutral-300">
              <strong className="text-neutral-100">{deleteTarget.name}</strong> beserta{" "}
              {deleteTarget.quantity} unit stok akan dihapus permanen.
            </span>
          )
        }
      />

      {/* Blocked delete info */}
      <Modal
        open={blockedInfo !== null && !showForceModal}
        onClose={() => setBlockedInfo(null)}
        title="Tidak bisa menghapus stok"
      >
        {blockedInfo && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
              {blockedInfo.error}
            </div>
            <p className="text-sm text-neutral-400">
              Stok <strong className="text-neutral-100">{blockedInfo.stock.name}</strong> masih dipakai oleh{" "}
              <strong className="text-neutral-100">{blockedInfo.orderCount}</strong> pesanan. Jika stok ini dihapus,
              semua pesanan terkait juga ikut terhapus.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setBlockedInfo(null)} className={btnGhost}>
                Batal
              </button>
              <button onClick={() => setShowForceModal(true)} className={btnDanger}>
                Tetap hapus stok
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Verifikasi ketik Hapus Stok */}
      <Modal open={showForceModal} onClose={() => setShowForceModal(false)} title="Verifikasi hapus stok">
        {blockedInfo && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              Untuk menghapus <strong className="text-neutral-100">{blockedInfo.stock.name}</strong> beserta{" "}
              {blockedInfo.orderCount} pesanan terkait, ketik{" "}
              <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-sm font-bold text-neutral-100">Hapus Stok</span>{" "}
              di bawah ini:
            </p>
            <input
              value={forceText}
              onChange={(e) => setForceText(e.target.value)}
              placeholder="Ketik: Hapus Stok"
              className={inputCls}
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setShowForceModal(false)} className={btnGhost} disabled={forceDeleting}>
                Batal
              </button>
              <button
                onClick={confirmForceDelete}
                disabled={forceText !== "Hapus Stok" || forceDeleting}
                className={btnDanger}
              >
                {forceDeleting && <Spinner className="h-4 w-4" />}
                Hapus Permanen
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
