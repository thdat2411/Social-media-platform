import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
// import { HfInference } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
// const client = new HfInference(HUGGING_FACE_API_KEY);

if (!HUGGING_FACE_API_KEY) {
  throw new Error("Hugging Face API key is missing");
}

// Utility function to fetch job description suggestions
// async function fetchHistoryRecommendation(keyword: string) {
//     const prompt = `Based on the search term '${keyword}, suggest a list of related skills, job titles, or industries that a LinkedIn user might be interested in. The list should include job roles like 'Software Engineer', 'Data Scientist', or 'Internship Opportunities' and related skills such as 'JavaScript', 'Python', or 'Machine Learning'. Also include industries like 'Technology', 'Finance', or 'Healthcare'. Provide at least 5-10 recommendations that a LinkedIn user would likely find relevant.`;

//     let output = "";
//     const stream = client.chatCompletionStream({
//         model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
//         messages: [{ role: "user", content: prompt }],
//         max_tokens: 1500,
//     });

//     for await (const chunk of stream) {
//         if (chunk.choices && chunk.choices[0].delta.content) {
//             output += chunk.choices[0].delta.content;
//         }
//     }

//     return output;
// }

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const history = await prisma.search_history.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json({ userHistory: history }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get("keyword");
    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const existingHistory = await prisma.search_history.findFirst({
      where: {
        user_id: user.id,
        term: keyword,
      },
    });
    if (existingHistory) {
      const history = await prisma.search_history.update({
        where: {
          id: existingHistory.id,
        },
        data: {
          created_at: new Date(),
        },
      });
      return NextResponse.json({ searchingHistory: history }, { status: 200 });
    }
    const searchingHistory = await prisma.search_history.create({
      data: {
        user_id: user.id,
        term: keyword,
      },
    });
    return NextResponse.json({ searchingHistory }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await prisma.search_history.deleteMany({
      where: {
        user_id: user.id,
      },
    });
    return NextResponse.json(
      { message: "History deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
