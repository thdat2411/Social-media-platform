import { HfInference } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const client = new HfInference(HUGGING_FACE_API_KEY);

if (!HUGGING_FACE_API_KEY) {
  throw new Error("Hugging Face API key is missing");
}

// Utility function to fetch job description suggestions
async function fetchJobDescription(
  jobTitle: string,
  company: string,
  location: string,
  workplaceType: string,
  jobType: string,
  level: string
) {
  const prompt = `Write a detailed job description for LinkedIn for the role of ${jobTitle} at ${company}. The position is a ${jobType} role as ${level} based in ${location}`;

  let output = "";
  const stream = client.chatCompletionStream({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
  });

  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices[0].delta.content) {
      output += chunk.choices[0].delta.content;
    }
  }

  return output;
}

export async function POST(req: NextRequest) {
  try {
    const { title, company_name, location, workplaceType, jobType, level } =
      await req.json();

    if (
      !title ||
      !company_name ||
      !location ||
      !workplaceType ||
      !jobType ||
      !level
    ) {
      return NextResponse.json(
        {
          error:
            "All parameters (jobTitle, company, location, skills, experience) are required.",
        },
        { status: 400 }
      );
    }

    const description = await fetchJobDescription(
      title,
      company_name,
      location,
      workplaceType,
      jobType,
      level
    );

    return NextResponse.json({ description }, { status: 200 });
  } catch (error) {
    console.error("Error generating job description:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the job description." },
      { status: 500 }
    );
  }
}
