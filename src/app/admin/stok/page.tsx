"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/client";
import { formatDate, formatIDR } from "@/lib/format";
import type { Stock } from "@/lib/types";
import { usePolling } from "@/components/hooks";
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  Spinner,
  btnGhost,
  btnPrimary,
  inputCls,
  useToast,
} from "@/components/ui";
import { BoxIcon, PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";

export default function KelolaStokPage() {
  const [stocks, setStocks] = useState<Stock[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Stock | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Stock | null>(null);
  const [deleting, setDeleting] = useState(false);
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
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (stock: Stock) => {
    setEditing(stock);
    setName(stock.name);
    setQuantity(String(stock.quantity));
    setUnitPrice(String(stock.unitPrice));
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const priceVal = unitPrice === "" ? undefined : Number(unitPrice);
      if (editing) {
        await api(`/api/stock/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({ name, quantity: quantity === "" ? undefined : Number(quantity), unitPrice: priceVal }),
        });
        show("Stok berhasil diperbarui.");
      } else {
        await api("/api/stock", {
          method: "POST",
          body: JSON.stringify({ name, quantity: Number(quantity), unitPrice: Number(unitPrice) }),
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
      show(e instanceof Error ? e.message : "Gagal menghapus.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toastNode}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Kelola Stok</h1>
          <p className="mt-1 text-sm text-slate-500">Atur jenis baju dan jumlah stok yang tersedia.</p>
        </div>
        <button onClick={openAdd} className={btnPrimary}>
          <PlusIcon className="h-4 w-4" /> Tambah Stok Baru
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {stocks === null ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Spinner className="h-7 w-7" />
          </div>
        ) : stocks.length === 0 ? (
          <EmptyState
            icon={<BoxIcon className="h-10 w-10" />}
            title="Belum ada jenis baju"
            subtitle="Klik 'Tambah Stok Baru' untuk mulai mencatat stok."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Nama Jenis Baju</th>
                  <th className="px-5 py-3">Jumlah Stok</th>
                  <th className="px-5 py-3">Harga Satuan</th>
                  <th className="px-5 py-3">Terakhir Diubah</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{stock.name}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          stock.quantity <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{formatIDR(stock.unitPrice)}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(stock.updatedAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(stock)}
                          aria-label={`Edit ${stock.name}`}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#1a73e8]"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(stock)}
                          aria-label={`Hapus ${stock.name}`}
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
        title={editing ? "Edit Jenis Baju" : "Tambah Stok Baru"}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label htmlFor="nama-baju" className="mb-1.5 block text-sm font-medium text-slate-700">
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
            <label htmlFor="jumlah-stok" className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <div>
            <label htmlFor="harga-satuan" className="mb-1.5 block text-sm font-medium text-slate-700">
              Harga Satuan (Rp)
            </label>
            <input
              id="harga-satuan"
              type="number"
              min={0}
              step="any"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="75000"
              className={inputCls}
              required
            />
          </div>

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
        message={
          deleteTarget && (
            <span>
              <strong className="text-slate-900">{deleteTarget.name}</strong> beserta{" "}
              {deleteTarget.quantity} unit stok akan dihapus permanen.
            </span>
          )
        }
      />
    </div>
  );
}
