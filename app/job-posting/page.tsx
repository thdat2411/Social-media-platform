import React from "react";
import getCurrentUser from "../actions/getCurrentUser";
import JobPostingMainContent from "./main-content";

const JobPostingPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="my-7 flex w-full flex-col items-center justify-center">
      <JobPostingMainContent user={user!} />
    </div>
  );
};

export default JobPostingPage;
