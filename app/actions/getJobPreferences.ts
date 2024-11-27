import { prisma } from "@/lib/prisma";

export const getJobPreferences = async (userId: string) => {
    try {
        const jobPreferences = await prisma.job_preference.findUnique({
            where: {
                user_id: userId,
            },
        });
        if (!jobPreferences) {
            return null;
        }
        return jobPreferences;
    } catch (error) {
        console.error("Error fetching job preferences:", error);
        return null;
    }
}