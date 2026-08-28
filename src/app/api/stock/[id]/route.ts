import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readJson, toInt, toNumber, trimmed } from "@/lib/validate";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await prisma.stock.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Jenis baju tidak ditemukan." }, { status: 404 });
  }

  const body = await readJson(req);
  const data: { name?: string; quantity?: number; unitPrice?: number } = {};

  if ("name" in body) {
    const name = trimmed(body.name, 80);
    if (!name) {
      return NextResponse.json({ error: "Nama jenis baju wajib diisi." }, { status: 400 });
    }
    const all = await prisma.stock.findMany({ select: { id: true, name: true } });
    if (all.some((s) => s.id !== id && s.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ error: `Jenis baju "${name}" sudah ada.` }, { status: 409 });
    }
    data.name = name;
  }

  if ("quantity" in body) {
    const quantity = toInt(body.quantity);
    if (quantity === undefined || quantity < 0) {
      return NextResponse.json({ error: "Jumlah stok harus berupa angka minimal 0." }, { status: 400 });
    }
    data.quantity = quantity;
  }

  if ("unitPrice" in body) {
    const unitPrice = toNumber(body.unitPrice);
    if (unitPrice === undefined || unitPrice <= 0) {
      return NextResponse.json({ error: "Harga satuan harus lebih dari 0." }, { status: 400 });
    }
    data.unitPrice = unitPrice;
  }

  const stock = await prisma.stock.update({ where: { id }, data });
  return NextResponse.json(stock);
}

export async function DELETE(req: Request, { params }: Params) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await prisma.stock.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!existing) {
    return NextResponse.json({ error: "Jenis baju tidak ditemukan." }, { status: 404 });
  }

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "true";
  const orderCount = await prisma.order.count({ where: { stockId: id } });

  if (orderCount > 0 && !force) {
    return NextResponse.json(
      {
        error: `Stok "${existing.name}" tidak bisa dihapus karena masih ada ${orderCount} pemesanan yang menggunakan stok ini.`,
        orderCount,
        requireForce: true,
      },
      { status: 409 }
    );
  }

  if (force) {
    // verifikasi ketik "Hapus Stok"
    const body = await readJson(req).catch(() => ({} as Record<string, unknown>));
    const confirmText = typeof body.confirmText === "string" ? body.confirmText : url.searchParams.get("confirmText");
    if (confirmText !== "Hapus Stok") {
      return NextResponse.json(
        { error: 'Verifikasi gagal. Ketik "Hapus Stok" dengan tepat untuk menghapus.' },
        { status: 400 }
      );
    }
    // hapus pesanan terkait dulu, baru stok
    await prisma.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { stockId: id } });
      await tx.stock.delete({ where: { id } });
    });
    return NextResponse.json({ ok: true, deletedOrders: orderCount });
  }

  await prisma.stock.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
