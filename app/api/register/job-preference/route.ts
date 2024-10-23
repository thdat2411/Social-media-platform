import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      job_titles,
      location_on_site,
      location_type,
      employments_types,
    } = body;

    if (!userId || !job_titles || !location_on_site) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const jobPreference = await prisma.job_preference.create({
      data: {
        user_id: userId,
        job_titles,
        location_on_site,
        location_type: location_type || [],
        employment_types: employments_types || [],
      },
    });

    return NextResponse.json(jobPreference);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return new NextResponse(err.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
