import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.messageTemplate.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await prisma.messageTemplate.create({
      data: {
        type: data.type,
        name: data.name,
        payload: typeof data.payload === "string" ? JSON.parse(data.payload) : data.payload,
      },
    });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
