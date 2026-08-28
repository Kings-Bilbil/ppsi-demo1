import { NextResponse } from "next/server";
import { INVALID_CODE_MESSAGE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readJson(req);
  const code = typeof body.code === "string" ? body.code.trim() : "";

  if (!/^[A-Za-z]{6}$/.test(code)) {
    return NextResponse.json({ error: INVALID_CODE_MESSAGE }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { purchaseCode: code },
    select: {
      status: true,
      buyerName: true,
      stockName: true,
      quantity: true,
      totalPrice: true,
      description: true,
      purchaseCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!order || order.status === "Selesai") {
    return NextResponse.json({ error: INVALID_CODE_MESSAGE }, { status: 404 });
  }

  return NextResponse.json(order);
}
