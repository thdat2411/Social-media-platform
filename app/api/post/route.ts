import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, content, image_url, preview_url } = body;
        if (!user_id || !content) {
            return NextResponse.json({ error: "user_id and content are required" }, { status: 400 })
        }
        const post = await prisma.post.create({
            data: {
                user_id,
                content,
                image_url,
                preview_url
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

export async function PUT(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const postId = url.searchParams.get("postId");
        if (!action || !postId) {
            return NextResponse.json({ error: "action and postId are required" }, { status: 400 })
        }
        if (action === "Like") {
            const like = await prisma.like.create({
                data: {
                    user_id: user.id,
                    entity_type: "post",
                    entity_id: postId,
                    postId: postId,
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
                        entity_id: postId,

                    }
                }
            })
            return NextResponse.json({ message: "Like removed" }, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}