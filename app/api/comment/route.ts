import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { deleteComment, insertComments, insertReplies, notifyUser } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const { user_id, post_id, content, image_url, preview_url, parent_id } = body;

        if (!user_id) {
            return NextResponse.json({ error: "user_id are required" }, { status: 400 });
        }

        if (!post_id && !parent_id) {
            return NextResponse.json({ error: "post_id or parent_id is required" }, { status: 400 });
        }

        let postIdForReply;
        if (parent_id) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parent_id },
                select: { post_id: true },
            });

            if (!parentComment) {
                return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
            }

            postIdForReply = parentComment.post_id;
        }


        const comment = await prisma.comment.create({
            data: {
                user_id,
                post_id: parent_id ? postIdForReply : post_id,
                content,
                image_url,
                preview_url,
                parent_id,
            },
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

        if (!comment) {
            return NextResponse.json({ error: "Post not created" }, { status: 500 });
        }

        const postAuthor = await prisma.post.findUnique({
            where: {
                id: comment.post_id
            },
            select: {
                user_id: true
            }
        });

        if (!postAuthor) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (currentUser.id !== postAuthor.user_id) {
            const notifcation = await prisma.notification.create({
                data: {
                    user_id: postAuthor.user_id!,
                    type: "comment",
                    content: "You have a new comment on your current post!",
                    post_id: post_id,
                },
            });

            if (!notifcation) {
                return NextResponse.json({ error: "Notification not created" }, { status: 500 });
            }
            await notifyUser(notifcation.user_id, notifcation.type, notifcation.content);
        }
        const commentWithCounts = {
            ...comment,
            likeCount: comment._count.likes,
            replyCount: comment._count.replies,
            likedByUser: comment.likes.some(like => like.user_id === user_id),
        };
        if (post_id) {
            await insertComments(commentWithCounts);
        }
        if (parent_id) {
            await insertReplies(commentWithCounts);
        }
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const postId = url.searchParams.get("postId");
        const commentId = url.searchParams.get("commentId");
        const limit = parseInt(url.searchParams.get("limit") || "3", 10);
        const cursor = url.searchParams.get("cursor");
        const currentUser = await getCurrentUser();



        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!postId && !commentId) {
            return NextResponse.json({ error: "postId or commentId is required" }, { status: 400 });
        }


        const comments = await prisma.comment.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: commentId
                ? { parent_id: commentId, post_id: postId || undefined }
                : postId
                    ? { post_id: postId, parent_id: null }
                    : undefined,
            include: {
                user: true,
                likes: {
                    select: { user_id: true }
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true,
                    }
                }
            },
            orderBy: { created_at: "desc" },

        });


        if (comments.length === 0) {
            return NextResponse.json({ comments: [], nextCursor: null }, { status: 200 });
        }

        const processedComments = comments.map(({ user, _count, likes, ...comment }) => ({
            ...comment,
            user,
            likeCount: _count.likes,
            replyCount: _count.replies,
            likedByUser: likes.some(like => like.user_id === currentUser.id),
        }));

        const nextCursor = comments.length === limit ? comments[comments.length - 1].id : null;

        return NextResponse.json({ comments: processedComments, nextCursor }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const url = new URL(req.url);
        const commentId = url.searchParams.get("commentId");
        const replyId = url.searchParams.get("replyId");
        if (!commentId && !replyId) {
            return NextResponse.json({ error: "id is required" }, { status: 400 })
        }
        let post;
        if (commentId) {
            post = await prisma.comment.findUnique({
                where: {
                    id: commentId
                },
                select: {
                    post_id: true
                }
            });
            await prisma.$transaction(async (prisma) => {
                await prisma.comment.deleteMany({
                    where: {
                        parent_id: commentId,
                    },
                });

                await prisma.comment.delete({
                    where: {
                        id: commentId,
                    },
                });
            });
            await deleteComment(post?.post_id as string, commentId);
            return NextResponse.json({ message: "Comment deleted" }, { status: 200 })
        }
        else {
            await prisma.comment.delete({
                where: {
                    id: replyId!,
                },
            });
        }
        return NextResponse.json({ message: "Comment deleted" }, { status: 200 })
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