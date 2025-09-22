import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  console.log("🛡️ Middleware triggered:", req.nextUrl.pathname);

  // ✅ ข้าม login/register
  if (
    req.nextUrl.pathname.startsWith("/api/auth/login") ||
    req.nextUrl.pathname.startsWith("/api/auth/register")||
    req.nextUrl.pathname.startsWith("/api/line/webhook")||
    req.nextUrl.pathname.startsWith("/api/line/bind")
  ) {
    console.log("➡️ Skip auth check:", req.nextUrl.pathname);
    return NextResponse.next();
  }

  // ✅ ตรวจทุก API
  if (req.nextUrl.pathname.startsWith("/api")) {
    const cookieToken = req.cookies.get("token")?.value;
    const headerToken = req.headers.get("authorization");

    console.log("🍪 Cookie token:", cookieToken);
    console.log("📩 Header token:", headerToken);

    const token = cookieToken || headerToken?.replace("Bearer ", "");

    if (!token) {
      console.log("⛔ No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("✅ Token valid:", decoded);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user", JSON.stringify(decoded));

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (err: any) {
      console.log("⛔ Invalid token:", err.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
  runtime: "nodejs", 
};

