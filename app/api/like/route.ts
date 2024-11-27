import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prisma';
import { handleLike, handleLikeComment } from '@/lib/pusher';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");
    if (!postId && !commentId) {
      return NextResponse.json({ error: "PostId OR CommentId is required" }, { status: 400 })
    }
    const like = await prisma.like.create({
      data: {
        user_id: user.id,
        entity_type: postId ? "post" : "comment",
        entity_id: postId ? postId! : commentId!,
        postId: postId ? postId : null,
        commentId: commentId ? commentId : null
      }
    });
    if (!like) {
      return NextResponse.json({ error: "Likes not found" }, { status: 404 })
    }
    if (postId) {
      await handleLike(like.postId!, like.user_id, "add");
    }
    if (commentId) {
      await handleLikeComment(like.commentId!, like.user_id, "add");
    }
    return NextResponse.json({ like }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");
    if (!postId && !commentId) {
      return NextResponse.json({ error: "PostId OR CommentId is required" }, { status: 400 })
    }
    await prisma.like.delete({
      where: {
        user_id_entity_type_entity_id: {
          user_id: user.id,
          entity_type: postId ? "post" : "comment",
          entity_id: (postId || commentId)!,
        }
      }
    }
    )
    if (postId) {
      await handleLike(postId, user.id, "delete");
    }
    if (commentId) {
      await handleLikeComment(commentId!, user.id, "delete");
    }
    return NextResponse.json({ message: "Like removed" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
