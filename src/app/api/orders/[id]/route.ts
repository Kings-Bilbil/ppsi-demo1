import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth";
import { isStatus } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { optionalText, readJson, toInt, trimmed } from "@/lib/validate";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  }

  const body = await readJson(req);
  const data: Record<string, unknown> = {};

  if ("buyerName" in body) {
    const buyerName = trimmed(body.buyerName, 120);
    if (!buyerName) {
      return NextResponse.json({ error: "Nama pembeli wajib diisi." }, { status: 400 });
    }
    data.buyerName = buyerName;
  }

  let targetStock = null as unknown as { id: string; name: string; quantity: number; unitPrice: number } | null;
  let targetStockChanged = false;
  if ("stockId" in body) {
    const stockId = typeof body.stockId === "string" ? body.stockId : "";
    const stock = stockId ? await prisma.stock.findUnique({ where: { id: stockId } }) : null;
    if (!stock) {
      return NextResponse.json({ error: "Pilih jenis baju yang valid." }, { status: 400 });
    }
    targetStock = stock;
    targetStockChanged = stock.id !== existing.stockId;
    data.stockId = stock.id;
    data.stockName = stock.name;
  }

  let quantityChanged = false;
  let newQuantity = existing.quantity;
  if ("quantity" in body) {
    const quantity = toInt(body.quantity);
    if (quantity === undefined || quantity < 1) {
      return NextResponse.json({ error: "Jumlah harus berupa angka minimal 1." }, { status: 400 });
    }
    newQuantity = quantity;
    quantityChanged = newQuantity !== existing.quantity;
    data.quantity = newQuantity;
  }

  // handle stock quantity adjustment and auto totalPrice
  if (targetStockChanged || quantityChanged) {
    const finalStock = targetStock ?? (existing.stockId ? await prisma.stock.findUnique({ where: { id: existing.stockId } }) : null);
    if (!finalStock) {
      return NextResponse.json({ error: "Stok asal tidak ditemukan." }, { status: 400 });
    }
    // determine effective stock for price
    const priceStock = targetStock ?? finalStock;
    // calculate stock adjustments
    if (targetStockChanged) {
      // restore old stock
      if (existing.stockId) {
        const oldStock = await prisma.stock.findUnique({ where: { id: existing.stockId } });
        if (oldStock) {
          await prisma.stock.update({ where: { id: oldStock.id }, data: { quantity: oldStock.quantity + existing.quantity } });
        }
      }
      // deduct new stock
      const freshNewStock = await prisma.stock.findUnique({ where: { id: priceStock.id } });
      if (!freshNewStock || freshNewStock.quantity < newQuantity) {
        // rollback restore if needed
        if (existing.stockId) {
          const oldStock2 = await prisma.stock.findUnique({ where: { id: existing.stockId } });
          if (oldStock2) await prisma.stock.update({ where: { id: oldStock2.id }, data: { quantity: oldStock2.quantity - existing.quantity } });
        }
        return NextResponse.json({ error: `Stok ${priceStock.name} tidak cukup. Sisa stok: ${freshNewStock?.quantity ?? 0}` }, { status: 400 });
      }
      await prisma.stock.update({ where: { id: priceStock.id }, data: { quantity: freshNewStock.quantity - newQuantity } });
    } else if (quantityChanged) {
      const diff = newQuantity - existing.quantity;
      const freshStock = await prisma.stock.findUnique({ where: { id: finalStock.id } });
      if (!freshStock) return NextResponse.json({ error: "Stok tidak ditemukan." }, { status: 400 });
      if (diff > 0 && freshStock.quantity < diff) {
        return NextResponse.json({ error: `Stok ${freshStock.name} tidak cukup. Sisa stok: ${freshStock.quantity}` }, { status: 400 });
      }
      await prisma.stock.update({ where: { id: freshStock.id }, data: { quantity: freshStock.quantity - diff } });
    }
    data.totalPrice = priceStock.unitPrice * newQuantity;
  }

  if ("description" in body) {
    data.description = optionalText(body.description);
  }

  let nextStatus: string | undefined;
  if ("status" in body) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }
    nextStatus = body.status;
    data.status = nextStatus;
  }

  if (nextStatus === "Selesai" && existing.status !== "Selesai") {
    data.completedAt = new Date();
  } else if (nextStatus && nextStatus !== "Selesai") {
    data.completedAt = null;
  }

  const order = await prisma.order.update({ where: { id }, data });
  return NextResponse.json(order);
}

export async function DELETE(_req: Request, { params }: Params) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  }
  // restore stock
  if (existing.stockId) {
    const stock = await prisma.stock.findUnique({ where: { id: existing.stockId } });
    if (stock) {
      await prisma.stock.update({ where: { id: stock.id }, data: { quantity: stock.quantity + existing.quantity } });
    }
  }
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}