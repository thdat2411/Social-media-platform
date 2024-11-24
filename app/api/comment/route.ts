import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, post_id, content, image_url, preview_url, parent_id } = body;
        if (!user_id && !content) {
            return NextResponse.json({ error: "user_id and content are required" }, { status: 400 })
        }
        const post = await prisma.comment.create({
            data: {
                user_id,
                post_id,
                content,
                image_url,
                preview_url,
                parent_id,
            }
        });
        if (!post) {
            return NextResponse.json({ error: "Post not created" }, { status: 500 })
        }
        return NextResponse.json({ post }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get("postId");
        const commentId = url.searchParams.get("commentId");
        const user = getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        if (!postId && !commentId) {
            return NextResponse.json({ error: "postId or commentId is required" }, { status: 400 })
        }
        const comments = await prisma.comment.findMany({
            where: commentId
                ? { parent_id: commentId }
                : postId
                    ? { post_id: postId }
                    : undefined,
            include: {
                user: true,
                likes: {
                    select: {
                        user_id: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,

                    }
                }
            }
        });
        const proccessedComments = comments.map(({ user, _count, likes, ...comment }) => {
            const likedByUser = likes.some(like => like.user_id === user.id);
            return {
                ...comment,
                user,
                likeCount: _count.likes,
                replyCount: _count.replies,
                likedByUser,
            }
        });
        return NextResponse.json({ comments: proccessedComments }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, content, image_url, preview_url } = body;
        if (!id || !content) {
            return NextResponse.json({ error: "id and content are required" }, { status: 400 })
        }
        const comment = await prisma.comment.update({
            where: {
                id
            },
            data: {
                content,
                image_url,
                preview_url,
                updated_at: new Date()
            }
        });
        if (!comment) {
            return NextResponse.json({ error: "Comment not updated" }, { status: 500 })
        }
        return NextResponse.json({ comment }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}