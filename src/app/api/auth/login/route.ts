import { NextResponse } from "next/server";
import { checkCredentials } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/session";
import { readJson } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await readJson(req);
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const token = await createSessionToken(username.trim());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
