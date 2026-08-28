const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomCode(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

export async function generateUniqueCode(length = 6): Promise<string> {
  const { prisma } = await import("./prisma");
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomCode(length);
    const exists = await prisma.order.findUnique({ where: { purchaseCode: code }, select: { id: true } });
    if (!exists) return code;
  }
  throw new Error("Gagal membuat kode unik. Coba lagi.");
}
