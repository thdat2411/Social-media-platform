import { prisma } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export const getUserJobPosts = async () => {
  const user = await getCurrentUser();
  try {
    const posts = await prisma.job_posting.findMany({
      where: {
        employer_id: user?.id,
      },
      include: {
        _count: {
          select: { job_applications: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!posts) {
      return null;
    }

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};
