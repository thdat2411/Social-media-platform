import { prisma } from "@/lib/prisma";

export const getCurrentJobPosting = async (id: string) => {
    try {
        const job_posting = await prisma.job_posting.findUnique({
            where: {
                id,
            },
        });
        if (!job_posting) {
            return null
        }
        return job_posting;
    } catch {
        return null;
    }

}