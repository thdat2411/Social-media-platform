import { prisma } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export const getPosts = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const posts = await prisma.post.findMany({
      include: {
        user: true, // Include post author details
        likes: {
          select: {
            user_id: true, // Only fetch the user_id from likes to optimize data transfer
          },
        },
        _count: {
          select: {
            comment: true, // Get comment count
            likes: true, // Get like count
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Process posts to include additional fields
    const processedPosts = posts.map(({ user, _count, likes, ...post }) => {
      const likedByUser = likes.some((like) => like.user_id === user?.id);

      return {
        ...post,
        user,
        commentCount: _count.comment,
        likeCount: _count.likes,
        likedByUser,
      };
    });

    return processedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};
