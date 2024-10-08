import React from "react";
import PostedSidebar from "../posted-sidebar";
import PostedJobsMainContent from "./main-content";

const PostedJobsPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <PostedSidebar />
        <PostedJobsMainContent />
      </div>
    </div>
  );
};

export default PostedJobsPage;
