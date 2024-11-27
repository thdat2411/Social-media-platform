import { CommentsWithLiked } from "@/app/feed/post";
import Pusher from "pusher";

// Initialize Pusher client
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

// Function to send notifications to Pusher channel
export const notifyUser = async (
  userId: string,
  type: string,
  message: string
) => {
  try {
    await pusher.trigger(`user-${userId}`, "new-notification", {
      message: message,
      userId: userId,
      type: type,
    });
    console.log(`Notification sent to user-${userId}`);
  } catch (error) {
    console.error(`Error publishing message for user ${userId}:`, error);
  }
};

export const notifyNewPost = async (postId: string) => {
    try {
        await pusher.trigger(`feed`, "new-post", {
            postId: postId,
        });
    } catch (error) {
        console.error(`Error publishing message`, error);
    }
}

export const insertComments = async (comment: CommentsWithLiked) => {
    try {
        await pusher.trigger(`post-${comment.post_id}`, "new-comment", {
            comment: comment,
        });
        console.log(`Comment sent to post-${comment.post_id}`);
    } catch (error) {
        console.error(`Error publishing message for post ${comment.post_id}:`, error);
    }
}

export const deleteComment = async (postId: string, commentId: string) => {
    try {
        console.log(postId);
        await pusher.trigger(`post-${postId}`, "delete-comment", {
            commentId: commentId,
        });
    } catch (error) {
        console.error(`Error deleting message for post: ${postId}`, error);
    }
}

export const insertReplies = async (comment: CommentsWithLiked) => {
    try {
        await pusher.trigger(`comment-${comment.parent_id}`, "new-reply", {
            comment: comment,
        });
        console.log(`Reply sent to comment-${comment.parent_id}`);
    } catch (error) {
        console.error(`Error publishing message for comment ${comment.parent_id}:`, error);
    }
}


export const handleLike = async (postId: string, userId: string, action: string) => {
    try {
        await pusher.trigger(`post-${postId}`, "handle-like", {
            userId: userId,
            action: action,
        })
    }
    catch (error) {
        console.error(`Error publishing message for post ${postId}:`, error);
    }
}

export const handleLikeComment = async (commentId: string, userId: string, action: string) => {
    try {
        await pusher.trigger(`comment-${commentId}`, "handle-like-comment", {
            userId: userId,
            action: action,
        })
    } catch (error) {
        console.error(`Error publishing message for comment ${commentId}:`, error);
    }
}

