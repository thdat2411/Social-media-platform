import { getCurrentJobPosting } from "@/app/actions/getCurrentJobPosting";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { getUserById } from "@/app/actions/getUserById";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobpostId = url.pathname.split("/").pop();
  try {
    const jobPost = await getCurrentJobPosting(jobpostId!);
    const employer = jobPost?.employer_id
      ? await getUserById(jobPost.employer_id)
      : null;
    const currentUser = await getCurrentUser();
    if (!jobPost || !employer) {
      return NextResponse.json(
        { error: "Job Post or Employer not found" },
        { status: 404 }
      );
    }
    const url = new URL(req.url);
    const jobpostId = url.pathname.split("/").pop();
    try {
      const jobPost = await getCurrentJobPosting(jobpostId!);
      const employer = jobPost?.employer_id
        ? await getUserById(jobPost.employer_id)
        : null;
      const currentUser = await getCurrentUser();
      if (!jobPost || !employer) {
        return NextResponse.json(
          { error: "Job Post or Employer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { jobPost, employer, currentUser },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    return NextResponse.json(
      { jobPost, employer, currentUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { job_listing_id, user_id, cover_letter, resume_url } = body;
  if (!job_listing_id || !user_id || !cover_letter || !resume_url) {
    return NextResponse.json({ error: "Missing info" }, { status: 400 });
  }
  try {
    const jobPost = await prisma.job_application.create({
      data: {
        job_listing_id,
        user_id,
        cover_letter,
        resume_url,
      }
    });
    if (!jobPost) {
      return NextResponse.json({ error: "Job Application not created" }, { status: 404 });
    }
    const jobListing = await prisma.job_posting.findUnique({
      where: { id: job_listing_id, status: "active" },
      include: { user: true },
    });
    if (!jobListing) {
      return NextResponse.json({ error: "Job Listing not found" }, { status: 404 });
    }

    if (jobListing) {
      const content = `You has new applicant for your  <strong>"${jobListing.title}"</strong> post. Check it out now!`;
      await notifyUser(jobListing.user!.id, content, "job_apply");
    }
    return NextResponse.json({ jobListing }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
  if (jobListing) {
    const content = `You has new applicant for your  <strong>"${jobListing.title}"</strong> post. Check it out now!`;
    await notifyUser(jobListing.user!.id, content, "job_apply");
  }
  return NextResponse.json({ jobListing }, { status: 200 });
} catch (error) {
  return NextResponse.json({ error: error }, { status: 400 });
}
}
