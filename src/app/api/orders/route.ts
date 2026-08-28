import { NextResponse } from "next/server";
import { generateUniqueCode } from "@/lib/code";
import { guardAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { optionalText, readJson, toInt, trimmed } from "@/lib/validate";

export async function GET() {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const orders = await prisma.order.findMany({
    where: { status: { not: "Selesai" } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const body = await readJson(req);

  const buyerName = trimmed(body.buyerName, 120);
  if (!buyerName) {
    return NextResponse.json({ error: "Nama pembeli wajib diisi." }, { status: 400 });
  }

  const stockId = typeof body.stockId === "string" ? body.stockId : "";
  const stock = stockId ? await prisma.stock.findUnique({ where: { id: stockId } }) : null;
  if (!stock) {
    return NextResponse.json({ error: "Pilih jenis baju yang valid." }, { status: 400 });
  }

  const quantity = toInt(body.quantity);
  if (quantity === undefined || quantity < 1) {
    return NextResponse.json({ error: "Jumlah harus berupa angka minimal 1." }, { status: 400 });
  }

  if (stock.quantity < quantity) {
    return NextResponse.json({ error: `Stok ${stock.name} tidak cukup. Sisa stok: ${stock.quantity}` }, { status: 400 });
  }

  const totalPrice = stock.unitPrice * quantity;

  const purchaseCode = await generateUniqueCode(6);

  const order = await prisma.$transaction(async (tx) => {
    await tx.stock.update({ where: { id: stock.id }, data: { quantity: stock.quantity - quantity } });
    return tx.order.create({
      data: {
        buyerName,
        stockId: stock.id,
        stockName: stock.name,
        quantity,
        totalPrice,
        description: optionalText(body.description),
        purchaseCode,
      },
    });
  });

  return NextResponse.json(order, { status: 201 });
}
