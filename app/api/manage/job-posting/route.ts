import getCurrentUser from "@/app/actions/getCurrentUser";
import { getUserJobPosts } from "@/app/actions/getUserJobPosts";
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

    let prioritizedPost = null;
    let jobPosts = [];

    const allJobPosts = await prisma.job_posting.findMany({
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
    });

    if (id) {
      prioritizedPost = allJobPosts.find((post) => post.id === id);

      jobPosts = allJobPosts.filter((post) => post.id !== id);
    } else {
      jobPosts = allJobPosts;
    }

    const paginatedPosts = jobPosts.slice((page - 1) * limit, page * limit);

    if (prioritizedPost) {
      paginatedPosts.unshift(prioritizedPost);
    }

    const totalJobPosts = allJobPosts.length;
    const totalPages = Math.ceil(totalJobPosts / limit);

    return NextResponse.json({ jobPosts: paginatedPosts, totalPages }, { status: 200 });
  } catch (error) {
    console.error(error);
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
    if (action !== "hide" && action !== "restore") {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid job post id" },
        { status: 400 }
      );
    }
    if (action === "hide") {
      const jobPostHidden = await prisma.job_posting.update({
        where: {
          id,
        },
        data: {
          status: "inactive",
        },
      });
      if (!jobPostHidden) {
        return NextResponse.json(
          { error: "Job post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Job post hidden" }, { status: 200 });
    } else if (action === "restore") {
      const jobPostRestore = await prisma.job_posting.update({
        where: {
          id,
        },
        data: {
          status: "active",
        },
      });
      if (!jobPostRestore) {
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

