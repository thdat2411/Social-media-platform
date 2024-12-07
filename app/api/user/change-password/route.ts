import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { newPassword, userId } = body;
    if (!newPassword) {
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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Change Password Error" },
      { status: 500 }
    );
  }
}
