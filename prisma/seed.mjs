import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomCode(len = 6) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

async function main() {
  await prisma.order.deleteMany();
  await prisma.stock.deleteMany();

  const stocks = await Promise.all(
    [
      { name: "Kemeja Formal", quantity: 24, unitPrice: 250000 },
      { name: "Kaos Polos", quantity: 60, unitPrice: 85000 },
      { name: "Jas Pengantin", quantity: 8, unitPrice: 2200000 },
      { name: "Kebaya Modern", quantity: 15, unitPrice: 750000 },
      { name: "Gamis", quantity: 18, unitPrice: 480000 },
      { name: "Seragam Kantor", quantity: 32, unitPrice: 250000 },
    ].map((s) => prisma.stock.create({ data: s }))
  );

  const byName = Object.fromEntries(stocks.map((s) => [s.name, s]));

  const orders = [
    {
      buyerName: "Rina Kartika",
      stockName: "Kebaya Modern",
      quantity: 2,
      totalPrice: 1500000,
      description: "Kebaya untuk pernikahan adik, warna dusty pink.",
      status: "Perencanaan",
      purchaseCode: "kRmQwA",
    },
    {
      buyerName: "Dedi Prasetyo",
      stockName: "Kemeja Formal",
      quantity: 3,
      totalPrice: 750000,
      description: null,
      status: "Perencanaan",
      purchaseCode: "pXnVbC",
    },
    {
      buyerName: "Sinta Melati",
      stockName: "Gamis",
      quantity: 1,
      totalPrice: 480000,
      description: "Ukuran XL, bahan katun premium.",
      status: "Sedang Proses",
      purchaseCode: "sJhGdE",
    },
    {
      buyerName: "Agus Wijaya",
      stockName: "Jas Pengantin",
      quantity: 1,
      totalPrice: 2200000,
      description: "Jas hitam slim fit, lingkar dada 100cm.",
      status: "Sedang Proses",
      purchaseCode: "cWqZyF",
    },
    {
      buyerName: "Maya Lestari",
      stockName: "Seragam Kantor",
      quantity: 5,
      totalPrice: 1250000,
      description: null,
      status: "Siap Diambil",
      purchaseCode: "bVtRmG",
    },
  ];

  for (const o of orders) {
    await prisma.order.create({
      data: {
        ...o,
        stockId: byName[o.stockName]?.id ?? null,
        purchaseCode: o.purchaseCode ?? randomCode(6),
      },
    });
    // decrement stock to reflect order
    const st = byName[o.stockName];
    if (st) {
      await prisma.stock.update({ where: { id: st.id }, data: { quantity: st.quantity - o.quantity } });
      st.quantity -= o.quantity;
    }
  }

  const history = [
    {
      buyerName: "Budi Santoso",
      stockName: "Kaos Polos",
      quantity: 10,
      totalPrice: 850000,
      description: "Kaos untuk acara reuni.",
      status: "Selesai",
    },
    {
      buyerName: "Fitri Handayani",
      stockName: "Gamis",
      quantity: 2,
      totalPrice: 960000,
      description: null,
      status: "Selesai",
      purchaseCode: "zAsDeH",
    },
  ];

  const now = Date.now();
  let i = history.length;
  for (const h of history) {
    await prisma.order.create({
      data: {
        ...h,
        stockId: byName[h.stockName]?.id ?? null,
        purchaseCode: h.purchaseCode ?? randomCode(6),
        completedAt: new Date(now - i * 36 * 60 * 60 * 1000),
      },
    });
    const st = byName[h.stockName];
    if (st) {
      await prisma.stock.update({ where: { id: st.id }, data: { quantity: st.quantity - h.quantity } });
      st.quantity -= h.quantity;
    }
    i--;
  }

  console.log("Seed selesai:", stocks.length, "stok,", orders.length, "pesanan aktif,", history.length, "riwayat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
