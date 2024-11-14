import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const history = await prisma.search_history.findMany({
            where: {
                user_id: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!history) {
            return NextResponse.json({ error: "History not found" }, { status: 404 });
        }
        return NextResponse.json({ userHistory: history }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
