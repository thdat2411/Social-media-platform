import getCurrentUser from "@/app/actions/getCurrentUser";
import { getUserJobPosts } from "@/app/actions/getUserJobPosts";
import React from "react";
import PostedSidebar from "../posted-sidebar";
import PostedJobsMainContent from "./main-content";

const PostedJobsPage = async () => {
  const jobPosts = await getUserJobPosts();
  const user = await getCurrentUser();
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar user={user!} />
        <PostedJobsMainContent jobPosts={jobPosts!} />
      </div>
    </div>
  );
};

export default PostedJobsPage;
