import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const networks = await prisma.$queryRaw`
            SELECT * FROM "user"
            WHERE id != ${user.id}
            ORDER BY RANDOM()
        `;

    if (!networks) {
      return NextResponse.json({ error: "Network not found" }, { status: 404 });
    }
    return NextResponse.json({ networks: networks }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
