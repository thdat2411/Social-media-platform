import React from "react";
import JobSidebar from "./sidebar";
import JobsMainContent from "./main-content";

const JobsPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto max-[700px]:flex-col max-[700px]:w-4/5 max-[700px]:space-y-4">
        <JobSidebar />
        <JobsMainContent />
      </div>
    </div>
  );
};

export default JobsPage;
