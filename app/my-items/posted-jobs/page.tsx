import { getPosts } from "@/app/actions/getPosts";
import React from "react";
import PostedSidebar from "../posted-sidebar";
import PostedJobsMainContent from "./main-content";

const PostedJobsPage = async () => {
  const jobPosts = await getPosts();
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar />
        <PostedJobsMainContent jobPosts={jobPosts!} />
      </div>
    </div>
  );
};

export default PostedJobsPage;
