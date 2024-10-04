
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

export const category = ["All", "People", "Jobs", "Posts"];
const datePost: Category = { title: "Date posted", content: ["Any time", "Past 24 hours", "Past week", "Past month"] };
const experience: Category = { title: "Experience level", content: ["Internship", "Entry level", "Associate", "Mid-Senior level"] };
const remote: Category = { title: "Remote", content: ["On-site", "Hybrid", "Remote"] };
export const header: Category[] = [datePost, experience, remote];

export type JobsPost = {
    title: string;
    company: string;
    location: string;
    date: string;
    description: string;
    experience: string;
    workplaceType: string;
    jobType: string;
    skill: string[];
}



export const JobsPostList: JobsPost[] = [{
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
}, {
    title: "Software Engineer",
    company: "Facebook",
    location: "Menlo Park, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
{
    title: "Software Engineer",
    company: "Tesla",
    location: "Palo Alto, CA",
    date: "2024-10-01T12:00:00",
    description: "We are looking for a software engineer to join our team.",
    experience: "Entry level",
    workplaceType: "Remote",
    jobType: "Full-time",
    skill: ["Write Communication", "Usability", "User Requirements", "User Experience", "User Interface Design", "User Research", "User Stories"]
},
]

export const jobPostingDescription: string = '<p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Tips: Provide a summary of the role, what success in the position looks like, and how this role fits into the organization.</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Responsibilities</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Be specific when describing each of the responsibilities. Use gender-neutral, inclusive language.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Determine and develop user requirements for systems in production, to ensure maximum usability</span></p><p><br></p><p><strong style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Qualifications</strong></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">[Some qualifications you may want to include are Skills, Education, Experience, or Certifications.]</span></p><p><span style="color: rgba(0, 0, 0, 0.9); background-color: rgb(255, 255, 255);">Example: Excellent verbal and written communication skills</span></p><p><br></p>'