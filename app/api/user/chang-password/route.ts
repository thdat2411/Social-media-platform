import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { newPassword, userId } = body;
    if (!newPassword || !userId) {
      return NextResponse.json({ error: "Missing info" }, { status: 400 });
    }
    const newHasedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password_hash: newHasedPassword,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Change Password Error" },
      { status: 500 }
    );
  }
}
