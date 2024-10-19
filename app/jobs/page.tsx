import React from "react";
import JobsMainContent from "./main-content";
import JobSidebar from "./sidebar";

const JobsPage = () => {
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl max-[700px]:w-4/5 max-[700px]:flex-col max-[700px]:space-y-4">
        <JobSidebar />
        <JobsMainContent />
      </div>
    </div>
  );
};

export default JobsPage;
