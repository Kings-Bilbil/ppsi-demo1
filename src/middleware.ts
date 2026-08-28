import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  // Verifikasi JWT penuh dilakukan di layout server (Node runtime), di Edge cukup cek keberadaan cookie agar ringan
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
