import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";

// ตั้งค่าใน .env.local
// LINE_LOGIN_CHANNEL_ID=xxxxxxxx
// ALLOW_UNVERIFIED_LINEID=true            // (ทางเลือก) อนุญาตโหมด dev ส่ง lineUserId ตรง ๆ

async function verifyIdToken(idToken: string) {
  // โหลด JWKs ของ LINE
  const JWKS = jose.createRemoteJWKSet(new URL("https://api.line.me/oauth2/v2.1/certs"));

  // ตรวจ token: issuer + audience (client_id ของ LINE Login channel)
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer: "https://access.line.me",
    audience: process.env.LINE_LOGIN_CHANNEL_ID,
  });

  // payload.sub = LINE userId
  return payload;
}

export async function POST(req: Request) {
  try {
    const { thaiId, idToken, lineUserId: rawLineUserId } = await req.json();

    if (!thaiId) {
      return NextResponse.json({ error: "กรุณาระบุ thaiId" }, { status: 400 });
    }

    let lineUserId: string | undefined;

    if (idToken) {
      // ✅ ทางที่ปลอดภัย: ใช้ idToken เพื่อ derive userId
      const payload = await verifyIdToken(idToken);
      lineUserId = String(payload.sub);
    } else if (rawLineUserId) {
      // ⚠️ ทางลัด (dev): รับ lineUserId ตรง ๆ
      if (process.env.ALLOW_UNVERIFIED_LINEID === "true") {
        lineUserId = String(rawLineUserId);
      } else {
        return NextResponse.json(
          { error: "ต้องส่ง idToken เท่านั้น (ไม่อนุญาต lineUserId ตรง ๆ)" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบ (ต้องมี idToken หรือ lineUserId)" },
        { status: 400 }
      );
    }

    // หา user จาก thaiId (ถ้า thaiId @unique ใช้ findUnique ได้เลย)
    const user = await prisma.initUser.findFirst({
      where: { thaiId: String(thaiId) },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้ในระบบ" }, { status: 404 });
    }

    // กันการผูกซ้ำ – ฝั่ง user
    if (user.lineId && user.lineId !== "") {
      return NextResponse.json({ error: "บัญชีนี้ถูกผูก LINE ไปแล้ว" }, { status: 409 });
    }

    // กันการผูกซ้ำ – ฝั่ง lineId
    const used = await prisma.initUser.findFirst({
      where: { lineId: lineUserId }, // เพราะ lineId @unique
    });
    if (used) {
      return NextResponse.json({ error: "LINE นี้ถูกผูกกับบัญชีอื่นแล้ว" }, { status: 409 });
    }

    // อัปเดตผูก lineId ให้ user
    await prisma.initUser.update({
      where: { id: user.id },
      data: { lineId: lineUserId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("bind error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการผูกบัญชี" }, { status: 500 });
  }
}
