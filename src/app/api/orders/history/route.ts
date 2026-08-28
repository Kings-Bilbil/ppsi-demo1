import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const unauthorized = await guardAdmin();
  if (unauthorized) return unauthorized;

  const orders = await prisma.order.findMany({
    where: { status: "Selesai" },
    orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(orders);
}
