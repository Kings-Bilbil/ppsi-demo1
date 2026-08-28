import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readJson, toInt, toNumber, trimmed } from "@/lib/validate";

export async function GET() {
  const stocks = await prisma.stock.findMany({ orderBy: [{ name: "asc" }] });
  return NextResponse.json(stocks);
}

export async function POST(req: Request) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const body = await readJson(req);
  const name = trimmed(body.name, 80);
  const quantity = toInt(body.quantity);
  const unitPrice = toNumber(body.unitPrice);

  if (!name) {
    return NextResponse.json({ error: "Nama jenis baju wajib diisi." }, { status: 400 });
  }
  if (quantity === undefined || quantity < 0) {
    return NextResponse.json({ error: "Jumlah stok harus berupa angka minimal 0." }, { status: 400 });
  }
  if (unitPrice === undefined || unitPrice < 0) {
    return NextResponse.json({ error: "Harga satuan tidak valid." }, { status: 400 });
  }

  const all = await prisma.stock.findMany({ select: { name: true } });
  if (all.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
    return NextResponse.json({ error: `Jenis baju "${name}" sudah ada.` }, { status: 409 });
  }

  const stock = await prisma.stock.create({ data: { name, quantity, unitPrice } });
  return NextResponse.json(stock, { status: 201 });
}
