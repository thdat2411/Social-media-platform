import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, email, role } = body;
  if (!id || !name || !email || !role) {
    return new Response("Missing info", { status: 400 });
  }
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name,
      email,
      role,
    },
  });
  return new Response(JSON.stringify(user), { status: 200 });
}
