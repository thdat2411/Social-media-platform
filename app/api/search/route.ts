import getCurrentUser from "@/app/actions/getCurrentUser";
import { getJobPosts } from "@/app/actions/getJobPosts";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const searchKeyword = url.searchParams.get("keyword");
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = 15; // Items per page

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (!searchKeyword && searchKeyword !== null) {
            {
                const jobPostings = await prisma.job_posting.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    contains: searchKeyword,
                                    mode: "insensitive",
                                },
                            },
                            {
                                job_type: {
                                    contains: searchKeyword,
                                    mode: "insensitive",
                                },
                            },
                        ],
                        status: "active",
                    },
                    include: {
                        user: true,
                    }
                });
                const users = await prisma.user.findMany({

                    where: {
                        name: {
                            contains: searchKeyword,
                            mode: "insensitive",
                        },
                    },
                });
                const posts = await prisma.post.findMany({
                    where: {
                        content: {
                            contains: searchKeyword,
                            mode: "insensitive",
                        },
                    },
                })
                return NextResponse.json({ jobPostings, users, posts }, { status: 200 });
            }
        } else {
            const jobPostings = await prisma.job_posting.findMany({
                where: {
                    status: "active"
                },
                include: {
                    user: true,
                    _count: {
                        select: { job_applications: true }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            const jobPostingsTotal = await getJobPosts();
            if (!jobPostingsTotal) {
                return NextResponse.json({ error: "No job postings found" }, { status: 404 });
            }
            const jobPostingsCount = jobPostingsTotal.length;

            if (!jobPostings) {
                return NextResponse.json({ error: "No job postings found" }, { status: 404 });
            }
            const totalPages = Math.ceil(jobPostingsCount / limit);

            return NextResponse.json({ jobPostings, totalPages, jobPostingsTotal, user }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}