import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.keyword.findMany({
      include: { template: { select: { id: true, name: true } } },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const created = await prisma.keyword.create({
      data: {
        keyword: data.keyword,
        fallback: data.fallback || null,
        templateId: data.templateId ?? null,
        status: data.status ?? "A",
      },
    });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
