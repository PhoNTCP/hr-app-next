import { NextResponse } from "next/server";

export async function POST() {
  // เคลียร์ cookie token ด้วย Max-Age=0
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
      },
    }
  );
}
