import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { replyMessage, verifyLineSignature } from "@/lib/line";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-line-signature") || "";
  const raw = await req.text();
  if (!verifyLineSignature(raw, signature, process.env.LINE_CHANNEL_SECRET!)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }
  const body = JSON.parse(raw);
  for (const event of body.events ?? []) {
    if (event.type === "message" && event.message.type === "text") {
      const text = (event.message.text || "").trim();
      const kw = await prisma.keyword.findFirst({
        where: { keyword: text, status: "A" },
        include: { template: true },
      });
      if (kw?.template) {
        await replyMessage(event.replyToken, kw.template.payload as any);
      } else {
        await replyMessage(event.replyToken, { type: "text", text: kw?.fallback || "ยังไม่พบคำสั่งนี้ในระบบ" });
      }
    }
  }
  return NextResponse.json({ ok: true });
}
