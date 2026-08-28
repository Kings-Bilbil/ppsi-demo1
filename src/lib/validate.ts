export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const data = await req.json();
    return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function trimmed(value: unknown, maxLength = 255): string | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  if (!s) return undefined;
  return s.slice(0, maxLength);
}

export function optionalText(value: unknown, maxLength = 1000): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  return s ? s.slice(0, maxLength) : null;
}

export function toInt(value: unknown): number | undefined {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  return Number.isInteger(n) ? n : undefined;
}

export function toNumber(value: unknown): number | undefined {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;
  return Number.isFinite(n) ? n : undefined;
}
