import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ รอ params ก่อน
  const item = await prisma.messageTemplate.findUnique({ where: { id: Number(id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await req.json();
    const updated = await prisma.messageTemplate.update({
      where: { id },
      data: {
        type: data.type,
        name: data.name,
        payload: typeof data.payload === "string" ? JSON.parse(data.payload) : data.payload,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.messageTemplate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
