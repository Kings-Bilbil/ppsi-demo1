export class ApiError extends Error {
  status?: number;
  orderCount?: number;
  requireForce?: boolean;
  constructor(message: string, extra?: { status?: number; orderCount?: number; requireForce?: boolean }) {
    super(message);
    this.status = extra?.status;
    this.orderCount = extra?.orderCount;
    this.requireForce = extra?.requireForce;
  }
}

export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => null)) as { error?: string; orderCount?: number; requireForce?: boolean } | null;
  if (!res.ok) {
    throw new ApiError(data?.error || "Terjadi kesalahan. Coba lagi.", {
      status: res.status,
      orderCount: data?.orderCount,
      requireForce: data?.requireForce,
    });
  }
  return data as T;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}
