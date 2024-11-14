import React from "react";
import { getJobPosts } from "../actions/getJobPosts";
import FooterLink from "../components/footerLink";
import JobsMainContent from "./main-content";
import JobSidebar from "./sidebar";

const JobsPage = async () => {
  const jobPosts = await getJobPosts();
  return (
    <div className="relative flex w-full justify-center">
      <div className="mt-6 flex w-[60%] justify-center max-[1600px]:w-[75%] max-[1400px]:w-[85%] max-[900px]:flex-col max-[900px]:items-center max-[900px]:justify-center max-[900px]:space-y-4">
        <JobSidebar />
        <JobsMainContent jobPosts={jobPosts!} />
        <div className="flex h-[150px] w-1/4 flex-col space-y-2 max-[900px]:w-[80%]">
          <FooterLink />
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
