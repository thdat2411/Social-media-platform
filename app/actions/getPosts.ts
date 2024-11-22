import { prisma } from "@/lib/prisma";

export const getPosts = async (currentUserId: string) => {
    try {
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
                        likes: true,   // Get like count
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        // Process posts to include additional fields
        const processedPosts = posts.map(({ user, _count, likes, ...post }) => {
            const likedByUser = likes.some(like => like.user_id === currentUserId);

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
