import { NextRequest } from "next/server";
import getCurrentUser from "./getCurrentUser";
import { prisma } from "@/lib/prisma";

const getCurrentUserApplications = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return [];
        }
        const applications = await prisma.job_application.findMany({
            where: {
                user_id: user.id,
            },
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                created_at: true,
                cover_letter: true,
                resume_url: true,
                job_listing_id: true,
                job_listings: {
                    select: {
                        title: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            }
                        }
                    },

                }
            }
        });
        if (!applications) {
            return null;
        }
        return applications;
    } catch (err) {
        console.error("Error in getApplications:", err);
    }

}
export default getCurrentUserApplications;