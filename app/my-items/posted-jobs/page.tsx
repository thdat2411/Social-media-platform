import React from "react";
import PostedSidebar from "../posted-sidebar";
import PostedJobsMainContent from "./main-content";

const PostedJobsPage = () => {
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar />
        <PostedJobsMainContent />
      </div>
    </div>
  );
};

export default PostedJobsPage;
