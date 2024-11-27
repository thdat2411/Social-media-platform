import getCurrentUser from "@/app/actions/getCurrentUser";
import getCurrentUserPosts from "@/app/actions/getCurrentUserPosts";
import React from "react";
import PostedSidebar from "../posted-sidebar";
import MyPostsMainContent from "./main-content";

const MyPostsPage = async () => {
  const user = await getCurrentUser();
  const posts = await getCurrentUserPosts();
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar userRole={user!.role!} />
        <MyPostsMainContent posts={posts!} />
      </div>
    </div>
  );
};

export default MyPostsPage;
