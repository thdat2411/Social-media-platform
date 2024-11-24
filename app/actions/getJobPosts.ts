import { prisma } from "@/lib/prisma";

export const getJobPosts = async () => {
  try {
    const posts = await prisma.job_posting.findMany({
      where: {
        status: "active",
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
