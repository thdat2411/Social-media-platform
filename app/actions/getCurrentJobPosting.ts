import { prisma } from "@/lib/prisma";

export const getCurrentJobPosting = async (id: string) => {
    try {
        const job_posting = await prisma.job_posting.findUnique({
            where: {
                id,
            },
            include: {
                _count: {
                    select: { job_applications: true }
                }
            }
        });
        if (!job_posting) {
            return null
        }



        return job_posting;
    } catch (error) {
        console.error("Error fetching job posting:", error);
        return null;
    }

}