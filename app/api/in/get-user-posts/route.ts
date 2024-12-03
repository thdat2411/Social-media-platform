import { prisma } from "@/lib/prisma";
import { orderBy } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 })
        }
        const posts = await prisma.post.findMany({
            where: {
                user_id: userId
            },
            include: {
                user: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        if (!posts) {
            return NextResponse.json({ error: "user not found" }, { status: 400 })
        }
        return NextResponse.json({ posts }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}