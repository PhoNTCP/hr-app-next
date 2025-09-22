import { NextResponse } from "next/server";
import { Client } from "@line/bot-sdk";
import crypto from "crypto";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

function verifyLineSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const hmac = crypto.createHmac("SHA256", CHANNEL_SECRET);
  const digest = hmac.update(rawBody).digest("base64");
  return signature === digest;
}

export async function POST(req: Request) {
  // อ่าน raw body เพื่อ verify
  const rawBody = await req.text();

  const signature = (req.headers as any).get("x-line-signature");
  if (!verifyLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const body = JSON.parse(rawBody);

  for (const event of body.events || []) {
    if (event.type === "message" && event.message.type === "text") {
      const text: string = event.message.text?.trim();

      if (text === "ลงทะเบียน") {
        // ลิงก์ไปหน้า LIFF (เปิดใน LINE)
        const liffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`;
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: `กดลิงก์เพื่อผูกบัญชี: ${liffUrl}`,
        });
      } else {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "พิมพ์คำว่า \"ลงทะเบียน\" เพื่อเริ่มผูกบัญชี LINE ครับ",
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
