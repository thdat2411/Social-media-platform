import { getCurrentJobPosting } from "@/app/actions/getCurrentJobPosting";
import { getJobPosts } from "@/app/actions/getJobPosts";
import { getUserById } from "@/app/actions/getUserById";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const jobpostId = url.pathname.split("/").pop();
    console.log(jobpostId);

    try {
        const jobPost = await getCurrentJobPosting(jobpostId!);
        if (!jobPost) {
            return NextResponse.json({ error: "Job Post not found" }, { status: 404 });
        }
        const allJobPosts = await getJobPosts();
        const author = jobPost?.employer_id
            ? await getUserById(jobPost.employer_id)
            : null;

        if (!jobPost || !author || !allJobPosts) {
            return NextResponse.json({ error: "Job Post or Employer not found" }, { status: 404 });
        }
        const authorsJobPosts = await Promise.all(allJobPosts.map(async (post) => {
            const author = post.employer_id ? await getUserById(post.employer_id) : null;
            return { ...post, author };
        }));
        if (!authorsJobPosts) {
            return NextResponse.json({ error: "Authors Job Posts not found" }, { status: 404 });
        }
        // Reorder job postings
        const reorderedJobPosts = [
            { ...jobPost, author },
            ...authorsJobPosts
                .filter((post) => post.id !== jobPost.id)
                .map((post) => ({ ...post, author: post.author })),
        ];
        return NextResponse.json({ jobPosts: reorderedJobPosts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error || "An error occurred" }, { status: 400 });
    }
}
