import crypto from "crypto";
export function verifyLineSignature(raw: string, sig: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(raw).digest("base64") === sig;
}
export async function replyMessage(replyToken: string, messages: any|any[]) {
  const arr = Array.isArray(messages) ? messages : [messages];
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ replyToken, messages: arr })
  });
}
