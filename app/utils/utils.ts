import { parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

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
}

type Category = {
    title: string;
    content: string[];
}

export const category = ["All", "Jobs", "Posts", "People"];
const datePost: Category = { title: "Date posted", content: ["Any time", "Past 24 hours", "Past week", "Past month"] };
const experience: Category = { title: "Experience level", content: ["Internship", "Entry level", "Associate", "Mid-Senior level"] };
const remote: Category = { title: "Remote", content: ["On-site", "Hybrid", "Remote"] };
export const jobHeader: Category[] = [datePost, experience, remote];

export type JobsPost = {
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
}
export type Post = {
    id: string;
    author: string;
    title: string;
    content: string;
    date: string;
    image?: string;
    like: number;
    comments: number;
}
export const Posts: Post[] = [{
    id: "1",
    author: "John Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5
},
{
    id: "2",
    author: "Jane Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5
},
{
    id: "3",
    author: "John Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5
},
{
    id: "4",
    author: "Jane Doe",
    title: "Software Engineer",
    content: "I am looking for a software engineer to join our team",
    date: "2024-10-01T12:00:00",
    like: 10,
    comments: 5
},
]

export const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();

    const daysAgo = differenceInDays(now, date);
    const hoursAgo = differenceInHours(now, date);
    const minutesAgo = differenceInMinutes(now, date);

    let result;

    if (daysAgo > 0) {
        result = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
        result = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
        result = `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
    return result;
}

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

export const jobPostingDescription: string = '<p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Tips: Provide a summary of the role, what success in the position looks like, and how this role fits into the organization.</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Responsibilities</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Be specific when describing each of the responsibilities. Use gender-neutral, inclusive language.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Determine and develop user requirements for systems in production, to ensure maximum usability</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Qualifications</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Some qualifications you may want to include are Skills, Education, Experience, or Certifications.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Excellent verbal and written communication skills</span></p><p><br></p>'

export const JobsPostList: JobsPost[] = [{
    id: "1",
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
}, {
    id: "2",
    title: "Software Engineer",
    company: "Facebook",
    location: "Menlo Park, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "3",
    title: "Software Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "4",
    title: "Software Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Director",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "5",
    title: "Software Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "6",
    title: "Software Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "7",
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "8",
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "9",
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
{
    id: "10",
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: jobPostingDescription,
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    level: "Entry level",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"],
    applicants: 10,
},
]

