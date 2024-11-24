import getCurrentUser from "@/app/actions/getCurrentUser";
import { getUserJobPosts } from "@/app/actions/getUserJobPosts";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    console.log(page);
    const limit = 15; // Items per page
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const jobPosts = await prisma.job_posting.findMany({
      where: {
        employer_id: user.id,
      },
      include: {
        user: true,
        job_applications: {
          include: {
            user: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log(jobPosts);

    const totalJobPosts = await getUserJobPosts();
    if (!totalJobPosts) {
      return NextResponse.json(
        { error: "No job posts found" },
        { status: 404 }
      );
    }
    const totalPages = Math.ceil(totalJobPosts.length / limit);
    return NextResponse.json({ jobPosts, totalPages }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error fetching job data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid job post id" },
        { status: 400 }
      );
    }
    if (action === "hide") {
      const jobPost = await prisma.job_posting.update({
        where: {
          id,
        },
        data: {
          status: "inactive",
        },
      });
      if (!jobPost) {
        return NextResponse.json(
          { error: "Job post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Job post hidden" }, { status: 200 });
    } else if (action === "restore") {
      const jobPost = await prisma.job_posting.update({
        where: {
          id,
        },
        data: {
          status: "active",
        },
      });
      if (!jobPost) {
        return NextResponse.json(
          { error: "Job post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Job post restored" },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Error hiding job post" },
      { status: 500 }
    );
  }
}
