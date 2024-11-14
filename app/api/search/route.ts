import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const keyword = url.searchParams.get("keyword");
        if (!keyword) {
            return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
        }
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const jobPostings = await prisma.job_posting.findMany({
            where: {
                title: {
                    contains: keyword,
                },
                OR: [
                    {
                        job_type: {
                            contains: keyword,
                        }
                    }
                ],
            },
        });
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: keyword,
                },
            },
        });
        const posts = await prisma.post.findMany({
            where: {
                content: {
                    contains: keyword,
                },
            },
        })
        return NextResponse.json({ jobPostings, users, posts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}