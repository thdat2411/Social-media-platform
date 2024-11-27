import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { notifyUser } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await request.json();
    const {
      title,
      company_name,
      description,
      workplace_type,
      job_type,
      level,
      required_skills,
      location,
      employer_id,
    } = body;
    if (
      !title ||
      !company_name ||
      !description ||
      !workplace_type ||
      !job_type ||
      !level ||
      !location ||
      !employer_id
    ) {
      return NextResponse.json({ error: "Missing info" }, { status: 400 });
    }
    const job_posting = await prisma.job_posting.create({
      data: {
        title,
        company_name,
        description,
        workplace_type,
        job_type,
        level,
        required_skills,
        location,
        employer_id,
        status: "active",
      },
    });
    if (!job_posting) {
      return NextResponse.json(
        { error: "Job posting not created" },
        { status: 500 }
      );
    }
    const posting_notification = await prisma.notification.create({
      data: {
        user_id: employer_id,
        type: "job_posting",
        content: `<strong>${company_name}</strong> have created a new jobs: "<strong>${title}</strong>". Check it out now!`,
        job_posting_id: job_posting.id,
      },
    });

    if (!posting_notification) {
      return NextResponse.json(
        { error: "Notification not created" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job_posting }, { status: 200 });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, company_name, description, workplace_type, job_type, level, required_skills, location, employer_id } = body;
    if (!title || !description || !workplace_type || !job_type || !level || !location || !employer_id) {
      return new NextResponse("Missing info", { status: 400 });
    }
    const job_posting = await prisma.job_posting.update({
      where: {
        id
      },
      data: {
        title,
        company_name,
        description,
        workplace_type,
        job_type,
        level,
        required_skills,
        location,
        employer_id
      }
    });
    const posting_notification = await prisma.notification.create({
      data: {
        user_id: employer_id,
        type: "job_posting_update",
        content: `The post "<strong>${title}</strong>" from <strong>${company_name}</strong> that you applied for has been updated. Click to see the changes!`,
        job_posting_id: job_posting.id,
      }
    });
    if (!job_posting) {
      return new NextResponse("Job posting not updated", { status: 500 });
    }
    const applicants = await prisma.job_application.findMany({
      where: {
        job_listing_id: id
      }
    });
    if (applicants) {
      for (const applicant of applicants) {
        try {
          if (applicant.user_id) {
            await notifyUser(applicant.user_id, posting_notification.content, posting_notification.type);
          }
        }
        catch {
          return new NextResponse("Error sending notification to applicant", { status: 500 });
        }
      }
    }
    if (!posting_notification) {
      return NextResponse.json({ error: "Notification not created" }, { status: 500 });
    }
    if (!job_posting) {
      return new NextResponse("Job posting not updated", { status: 500 });
    }
    return NextResponse.json({ job_posting }, { status: 200 });

  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
