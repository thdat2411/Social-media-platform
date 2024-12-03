// pages/api/posts.ts
import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get("page") ?? "1";
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const posts = await prisma.post.findMany({
            skip: (Number(page) - 1) * 3,
            take: 3,
            include: {
                user: true,
                likes: {
                    select: {
                        user_id: true,
                    },
                },
                _count: {
                    select: {
                        comment: true,
                        likes: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!posts) {
            return NextResponse.json({ error: "No posts found" }, { status: 404 });
        }

        const processedPosts = posts.map(({ user, _count, likes, ...post }) => {
            const likedByUser = likes.some((like) => like.user_id.trim() === currentUser!.id.trim());
            return {
                ...post,
                user,
                commentCount: _count.comment,
                likeCount: _count.likes,
                likedByUser,
            };
        });

        return NextResponse.json({ posts: processedPosts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

