import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const id = url.searchParams.get("id");
        const limit = 15; // Items per page
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let applications = [];
        let totalCount = 0;

        if (id) {
            if (page === 1) {
                // Case: `id` provided and it's the first page
                const targetedApplication = await prisma.job_application.findFirst({
                    where: {
                        user_id: user.id,
                        id: id,
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
                                    },
                                },
                            },
                        },
                    },
                });

                const otherApplications = await prisma.job_application.findMany({
                    where: {
                        user_id: user.id,
                        id: { not: id },
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
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                    take: limit - 1, // Reserve one slot for the targeted item
                });

                applications = targetedApplication
                    ? [targetedApplication, ...otherApplications]
                    : otherApplications;

                totalCount = await prisma.job_application.count({
                    where: {
                        user_id: user.id,
                    },
                });
            } else {
                // Case: `id` provided and it's NOT the first page
                applications = await prisma.job_application.findMany({
                    where: {
                        user_id: user.id,
                        id: { not: id }, // Exclude the targeted item
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
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                });

                totalCount = await prisma.job_application.count({
                    where: {
                        user_id: user.id,
                        id: { not: id },
                    },
                });
            }
        } else {
            // Case: No `id` provided
            applications = await prisma.job_application.findMany({
                where: {
                    user_id: user.id,
                },
                orderBy: {
                    created_at: "desc",
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            totalCount = await prisma.job_application.count({
                where: {
                    user_id: user.id,
                },
            });
        }

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({ applications, totalPages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching job data:", error);
        return NextResponse.json(
            { error: "Error fetching job data" },
            { status: 500 }
        );
    }
}
