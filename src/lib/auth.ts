import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken, type SessionUser } from "./session";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function checkCredentials(username: unknown, password: unknown): boolean {
  if (typeof username !== "string" || typeof password !== "string") return false;
  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  if (username.trim() !== validUsername) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim().toLowerCase();
  if (hash) return hashPassword(password) === hash;
  return password === (process.env.ADMIN_PASSWORD ?? "admin123");
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function guardAdmin(): Promise<NextResponse | null> {
  const store = await cookies();
  const user = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!user) {
    return NextResponse.json({ error: "Sesi berakhir. Silakan login kembali." }, { status: 401 });
  }
  return null;
}
