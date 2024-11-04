import { prisma } from "@/lib/prisma";

export const getCurrentJobPosting = async (id: string) => {
    try {
        const job_posting = await prisma.job_posting.findUnique({
            where: {
                id,
            },
            include: {
                job_applications: true,
            }
        });
        if (!job_posting) {
            return null
        }

        const { job_applications, ...job_posting_fields } = job_posting;

        const job_posting_with_applicant_count = {
            ...job_posting_fields,
            applicantCount: job_applications.length
        };

        return job_posting_with_applicant_count;
    } catch (error) {
        console.error("Error fetching job posting:", error);
        return null;
    }

}