import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { deleteComment, insertComments, insertReplies, notifyUser } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, post_id, content, image_url, preview_url, parent_id } = body;
    if (!user_id || (!content && !image_url && !preview_url) || (!post_id && !parent_id)) {
      return NextResponse.json({ error: "Info is required" }, { status: 400 })
    }
    let commentIdForReply;
    let postUserIdForComment;
    if (parent_id) {
      commentIdForReply = await prisma.comment.findUnique({
        where: {
          id: parent_id
        },
        select: {
          post_id: true,
          user_id: true
        }
      })
    }
    else {
      postUserIdForComment = await prisma.post.findUnique({
        where: {
          id: post_id
        },
        select: {
          user_id: true
        }
      })
    }

    const comment = await prisma.comment.create({
      data: {
        user_id,
        post_id: parent_id ? commentIdForReply?.post_id : post_id,
        content,
        image_url: image_url ? image_url : null,
        preview_url: preview_url ? preview_url : null,
        parent_id: parent_id ? parent_id : null,
      },
      include: {
        user: true
      }
    })

    if ((parent_id && commentIdForReply?.user_id !== user_id) || (post_id && postUserIdForComment?.user_id !== user_id)) {
      await prisma.notification.create({
        data: {
          user_id: parent_id ? commentIdForReply?.post_id ?? "" : postUserIdForComment?.user_id ?? "",
          type: parent_id ? "reply" : "comment",
          content: parent_id ? "You have a new reply on your comment recently" : "You have a new comment on your post recently",
          is_read: false,
          post_id: post_id
        }
      })
      if (parent_id) {
        await notifyUser(commentIdForReply?.user_id!, "reply", content)
      }
      else {
        await notifyUser(postUserIdForComment?.user_id!, "comment", content)
      }
    }
    const processedComment = {
      ...comment,
      likeCount: 0,
      replyCount: 0,
      likedByUser: false,
    }
    if (parent_id) {
      await insertReplies(processedComment)
    }
    else {
      await insertComments(processedComment)
    }
    return NextResponse.json({ comment }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const commentId = url.searchParams.get("commentId");
    const limit = parseInt(url.searchParams.get("limit") || "3", 10);
    const cursor = url.searchParams.get("cursor");
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (!postId && !commentId) {
      return NextResponse.json({ error: "postId or commentId is required" }, { status: 400 })
    }

    const whereClause = commentId
      ? { parent_id: commentId, post_id: postId || undefined }
      : postId
        ? { post_id: postId, parent_id: null }
        : undefined;


    const comments = await prisma.comment.findMany({
      where: whereClause,
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
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: {
        created_at: "desc"
      }
    });

    const hasNextPage = comments.length > limit;
    const nextCursor = hasNextPage ? comments[limit]?.id : null;

    const proccessedComments = comments.slice(0, limit).map(({ user, _count, likes, ...comment }) => {
      const likedByUser = likes.some(like => like.user_id === user.id);
      return {
        ...comment,
        user,
        likeCount: _count.likes,
        replyCount: _count.replies,
        likedByUser,
      }
    });
    return NextResponse.json({ comments: proccessedComments, nextCursor }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, content, image_url, preview_url } = body;
    if (!id || !content) {
      return NextResponse.json(
        { error: "id and content are required" },
        { status: 400 }
      );
    }
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
        image_url,
        preview_url,
        updated_at: new Date(),
      },
    });
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not updated" },
        { status: 500 }
      );
    }
    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

