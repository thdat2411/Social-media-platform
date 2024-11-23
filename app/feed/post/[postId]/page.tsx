import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import FeedSideBar from "../../sidebar";
import SinglePostMainContent from "./main-content";

const PostPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <FeedSideBar user={user!} />
        <SinglePostMainContent user={user!} />
      </div>
    </div>
  );
};

export default PostPage;
