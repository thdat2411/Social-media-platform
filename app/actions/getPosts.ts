import { prisma } from "@/lib/prisma";

export const getPosts = async () => {
    try {
        const posts = await prisma.job_posting.findMany({
            include: {
                job_applications: true,
            },
        });

        if (!posts) {
            return null;
        }

        const postsWithApplicantCount = posts.map(({ job_applications, ...post }) => ({
            ...post,
            applicantCount: job_applications.length,
        }));

        return postsWithApplicantCount;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
}