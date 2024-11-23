import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        console.log(user)
        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const postId = url.searchParams.get("postId");
        const commentId = url.searchParams.get("commentId");
        if (!action) {
            return NextResponse.json({ error: "Action are required" }, { status: 400 })
        }
        if (!postId && !commentId) {
            return NextResponse.json({ error: "PostId OR CommentId is required" }, { status: 400 })
        }
        if (action === "Like") {
            const like = await prisma.like.create({
                data: {
                    user_id: user.id,
                    entity_type: "post",
                    entity_id: postId ? postId! : commentId!,
                    postId: postId,
                    commentId: commentId
                }
            });
            if (!like) {
                return NextResponse.json({ error: "Like not created" }, { status: 500 })
            }
            return NextResponse.json({ like }, { status: 200 })
        }
        else if (action === "Dislike") {
            await prisma.like.delete({
                where: {
                    user_id_entity_type_entity_id: {
                        user_id: user.id,
                        entity_type: "post",
                        entity_id: postId ? postId! : commentId!,
                    }
                }
            })
            return NextResponse.json({ message: "Like removed" }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}