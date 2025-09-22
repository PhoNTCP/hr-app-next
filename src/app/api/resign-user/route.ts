"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET Users
export async function GET() {
  const users = await prisma.initUser.findMany({
  where: {
    status: "I",     // หาคนที่มี ยังไม่ลาออก
  },
});;
  return NextResponse.json(users);
}

// POST New User
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const user = await prisma.initUser.create({
      data: {
        thaiId: body.thaiId,
        code: body.code,
        empCode: body.empCode,
        name: body.name,
        surname: body.surname,
        engName: body.engName,
        engSurname: body.engSurname,
        title: body.title,
        nickName: body.nickName,
        email: body.email,
        lineId: body.lineId,
        line: body.line,
        bot: body.bot,
        bankNo: body.bankNo,
        companyPhoneNo: body.companyPhoneNo,
        internalExtension: body.internalExtension,
        personalPhoneNo: body.personalPhoneNo,
        status: body.status,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}

// PUT แก้ไข user (ต้องส่ง id ใน body)
export async function PUT(req: Request) {
  const data = await req.json();
  const { id, ...updateData } = data;

  const user = await prisma.initUser.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return NextResponse.json(user);
}

// DELETE (soft delete → status=I) ต้องส่ง id ใน body หรือ query string
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const result = await prisma.initUser.updateMany({
    where: { id: Number(id) },
    data: { status: "D" },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

