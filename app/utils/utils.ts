import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import skills from "../utils/linkedin_skills.txt";

export const defaultEvent = {
  eventName: "",
  description: "",
  address: "",
  venue: "",
  startDate: new Date().toLocaleDateString(),
  endDate: new Date().toLocaleDateString(),
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  isInPerson: false,
  zone: "",
  headerImage: "",
};
export const capitalizeFirstLetter = (string: string) => {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function transformDateString(dateString: string) {
  const match = dateString.match(/(\d+)\s+(days?|hours?|minutes?|seconds?)\s+ago/);
  if (match) {
    const value = match[1];
    const unit = match[2].charAt(0); // Get the first letter of the unit
    return `${value}${unit}`;
  }
  return dateString; // Return the original string if no match is found
}

type Category = {
  title: string;
  content: string[];
};

export const skillList = skills
  .split("\n")
  .map((skill) => skill.trim())
  .filter((skill) => skill);

export const category = ["All", "Jobs", "Posts", "People"];
const datePost: Category = {
  title: "Date posted",
  content: ["Any time", "Past 24 hours", "Past week", "Past month"],
};
const experience: Category = {
  title: "Experience level",
  content: ["Internship", "Entry level", "Associate", "Mid-Senior level"],
};
const remote: Category = {
  title: "Remote",
  content: ["On-site", "Hybrid", "Remote"],
};
export const jobHeader: Category[] = [datePost, experience, remote];

export type JobsPost = {
  employer_id: string | null;
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  experience: string;
  workplaceType: string;
  jobType: string;
  level: string;
  skill: string[];
  applicants: number;
};
export type Post = {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  like: number;
  comments: number;
};
export const Posts: Post[] = [
  {
    id: "1",
    author: "John Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5,
  },
  {
    id: "2",
    author: "Jane Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5,
  },
  {
    id: "3",
    author: "John Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5,
  },
  {
    id: "4",
    author: "Jane Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5,
  },
];

export const formatDate = (date: Date) => {
  const now = new Date();

  const daysAgo = differenceInDays(now, date);
  const hoursAgo = differenceInHours(now, date);
  const minutesAgo = differenceInMinutes(now, date);

  let result;

  if (daysAgo > 0) {
    result = `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else if (hoursAgo > 0) {
    result = `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else {
    result = `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  }
  return result;
};

export const base64ToFile = (base64String: string, fileName: string): File => {
  // Check if the base64 string has a prefix and split if necessary
  const parts = base64String.split(",");
  const isBase64 = parts.length === 2 && parts[0].startsWith("data:");

  if (!isBase64) {
    throw new Error("Invalid base64 string");
  }

  const base64 = parts[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "image/jpeg" }); // Adjust MIME type if necessary
  return new File([blob], fileName, { type: blob.type });
};

export const jobPostingDescription: string =
  '<p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Tips: Provide a summary of the role, what success in the position looks like, and how this role fits into the organization.</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Responsibilities</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Be specific when describing each of the responsibilities. Use gender-neutral, inclusive language.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Determine and develop user requirements for systems in production, to ensure maximum usability</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Qualifications</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Some qualifications you may want to include are Skills, Education, Experience, or Certifications.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Excellent verbal and written communication skills</span></p><p><br></p>';


export const coverLetterSample: string = '<p>Dear [Employer\'s Name],</p><p><br></p><p>I am writing to express my interest in the [Job Title] position at [Company\'s Name] as advertised on [where you found the job posting]. With my background in [Your Field/Industry] and [number] years of experience in [specific relevant experience], I am confident in my ability to contribute effectively to your team.</p><p><br></p><p>In my previous role at [Your Previous Company], I successfully [describe a relevant achievement or responsibility that relates to the job]. This experience honed my skills in [mention specific skills relevant to the job], which I believe will be valuable in the [Job Title] role at [Company\'s Name].</p><p><br></p><p>I am particularly drawn to this position at [Company\'s Name] because [mention something specific about the company or its values that appeals to you]. I admire [specific aspect of the company or its mission], and I am eager to contribute to your team with my expertise in [relevant skills or experience].</p><p><br></p><p>I am excited about the opportunity to bring my unique talents to [Company\'s Name] and help drive [mention a specific goal or project]. Thank you for considering my application. I look forward to the possibility of discussing how I can contribute to your team.</p><p><br></p><p>Warm regards,</p><p>[Your Name]</p>';
