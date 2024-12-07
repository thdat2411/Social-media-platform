import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password_hash, role } = body;
    if (!email || !password_hash || !name || !role) {
      return new NextResponse("Missing info", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password_hash: hashedPassword,
        role,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
