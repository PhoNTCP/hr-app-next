import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const item = await prisma.keyword.findUnique({
      where: { id },
      include: { template: { select: { id: true, name: true } } },
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await req.json();
    const updated = await prisma.keyword.update({
      where: { id },
      data: {
        keyword: data.keyword,
        fallback: data.fallback || null,
        templateId: data.templateId ?? null,
        status: data.status ?? "A",
      },
      include: { template: { select: { id: true, name: true } } },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.keyword.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
