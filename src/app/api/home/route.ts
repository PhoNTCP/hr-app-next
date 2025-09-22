import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const userHeader = req.headers.get("x-user");
  if (!userHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const total = await prisma.initUser.count();
  const registered = await prisma.initUser.count({
    where: {
      AND: [
        { lineId: { not: null } },
        { lineId: { not: "" } },
      ],
    },
  });

  const pending = total - registered;

  return NextResponse.json({
    stats: { total, registered, pending },
  });
}
