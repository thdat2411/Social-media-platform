export const maxDuration = 60;

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
  const prompt = `Assume you are a recruiter. Write a comprehensive and detailed job description for the role of ${jobTitle} at ${company}. The position is a ${jobType} role at the ${level} level, based in ${location}. This is a ${workplaceType} position. The description should include the following:
  1. An introduction to the company and its mission.
  2. The reasons why the company is hiring for this role.
  3. Detailed responsibilities and day-to-day tasks of the role.
  4. Specific job requirements, including skills, qualifications, and experience needed.
  5. What the company offers, such as benefits, career growth opportunities, and work environment.
  6. Any additional information that would attract potential candidates.`;

  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 30000)
  );

  const streamPromise = (async () => {
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
  })();

  return Promise.race([streamPromise, timeoutPromise]);
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
