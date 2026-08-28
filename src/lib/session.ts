import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tailor_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionUser {
  username: string;
}

function getKey() {
  const secret = process.env.AUTH_SECRET ?? "dev-only-secret-ganti-di-produksi";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey());
    return typeof payload.sub === "string" && payload.sub.length > 0 ? { username: payload.sub } : null;
  } catch {
    return null;
  }
}
