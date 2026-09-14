import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function randomCode(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return out;
}

const seedStocks = [
  { name: 'Kemeja Formal Premium', quantity: 150, unitPrice: 250000, costPrice: 150000 },
  { name: 'Kaos Polos Cotton 30s', quantity: 300, unitPrice: 85000, costPrice: 45000 },
  { name: 'Jas Pengantin Eksklusif', quantity: 30, unitPrice: 2200000, costPrice: 1200000 },
  { name: 'Kebaya Modern Payet', quantity: 45, unitPrice: 750000, costPrice: 400000 },
  { name: 'Gamis Syari Elegan', quantity: 80, unitPrice: 480000, costPrice: 250000 },
  { name: 'Seragam Kantor Drill', quantity: 200, unitPrice: 250000, costPrice: 140000 },
  { name: 'Kemeja Batik Tulis', quantity: 25, unitPrice: 1500000, costPrice: 800000 },
  { name: 'Celana Bahan Pria', quantity: 120, unitPrice: 350000, costPrice: 180000 },
  { name: 'Rok Span Wanita', quantity: 90, unitPrice: 280000, costPrice: 130000 }
];

const buyerNames = ['Budi', 'Andi', 'Siti', 'Ani', 'Joko', 'Dewi', 'Ahmad', 'Rina', 'Rudi', 'Sri', 'Putra', 'Putri', 'Fajar', 'Dina', 'Eko', 'Sari', 'Hendri', 'Nita', 'Wahyu', 'Mega'];
const statuses = ['Perencanaan', 'Sedang Proses', 'Siap Diambil', 'Selesai'];
const paymentStatuses = ['Belum DP', 'Sudah DP', 'Lunas'];

async function main() {
  console.log('Seeding heavily...');
  for (const s of seedStocks) {
    const existing = await prisma.stock.findUnique({ where: { name: s.name } });
    if (!existing) {
      await prisma.stock.create({ data: s });
    }
  }

  const stocks = await prisma.stock.findMany();

  // Create 30 random orders
  for (let i = 0; i < 50; i++) {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const totalPrice = stock.unitPrice * quantity;
    
    let amountPaid = 0;
    if (paymentStatus === 'Sudah DP') amountPaid = totalPrice * 0.5;
    if (paymentStatus === 'Lunas') amountPaid = totalPrice;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60)); // Random past 60 days

    await prisma.order.create({
      data: {
        buyerName: buyerNames[Math.floor(Math.random() * buyerNames.length)] + ' ' + randomCode(3),
        stockId: stock.id,
        stockName: stock.name,
        quantity,
        totalPrice,
        paymentStatus,
        amountPaid,
        status,
        purchaseCode: randomCode(6),
        description: 'Random order',
        createdAt,
        completedAt: status === 'Selesai' ? new Date() : null,
      }
    });
  }

  console.log('Done generating heavy dummy data!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
