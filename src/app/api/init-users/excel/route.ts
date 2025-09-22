"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const users = await prisma.initUser.findMany({
    select: {
      thaiId: true,
      code: true,
      name: true,
      surname: true,
      title: true,
      lineId: true,
      engName: true,
      engSurname: true,
      empCode: true,
      bankNo: true,
      status: true,
      bot: true,
      nickName: true,
      companyPhoneNo: true,
      internalExtension: true,
      email: true,
    },
  });

  const worksheet = XLSX.utils.json_to_sheet(users);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="users.xlsx"',
    },
  });
}

  export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // แปลงเป็น buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  // insert ลง DB
  for (const row of rows) {
    await prisma.initUser.create({
      data: {
        thaiId: row.thaiId?.toString() || "",
        code: row.code?.toString() || "",
        name: row.name?.toString() || "",
        surname: row.surname?.toString() || "",
        title: row.title?.toString() || "",
        lineId: row.lineId?.toString() || null,
        engName: row.engName?.toString() || "",
        engSurname: row.engSurname?.toString() || "",
        empCode: row.empCode?.toString() || "",
        bankNo: row.bankNo?.toString() || "",
        status: row.status?.toString() || "A",
        bot: row.bot?.toString() || "",
        nickName: row.nickName?.toString() || "",
        companyPhoneNo: row.companyPhoneNo?.toString() || "",
        internalExtension: row.internalExtension?.toString() || "",
        email: row.email?.toString() || "",
      },
    });
  }

  return NextResponse.json({ success: true, count: rows.length });
}

