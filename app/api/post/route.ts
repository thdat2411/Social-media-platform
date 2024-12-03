
import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { notifyNewPost } from "@/lib/pusher";
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
    await notifyNewPost(post.id);
    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }
    const currentUser = await getCurrentUser();
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    const likedByUser = post.likes.some((like) => {
      return like.user_id === currentUser?.id;
    });
    const returnedPost = {
      ...post,
      user: post.user,
      commentCount: post._count.comment,
      likeCount: post._count.likes,
      likedByUser,
    }
    return NextResponse.json({ post: returnedPost }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, content, image_url, preview_url } = body;
    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        image_url,
        preview_url
      }
    });
    if (!post) {
      return NextResponse.json({ error: "Post not updated" }, { status: 500 })
    }
    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
