import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, image } = body;
    if (!image || !userId) {
      return Response.json({ error: "Missing info" }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image,
      },
    });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch {
    return Response.json({ error: "Error" }, { status: 400 });
  }
}
