import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, company_name, description, workplace_type, job_type, level, required_skills, location, employer_id } = body;
        if (!title || !company_name || !description || !workplace_type || !job_type || !level || !location || !employer_id) {
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
                employer_id
            },
        });

        if (!job_posting) {
            return NextResponse.json({ error: "Job posting not created" }, { status: 500 });
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
        if (!id || !title || !company_name || !description || !workplace_type || !job_type || !level || !location || !employer_id) {
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