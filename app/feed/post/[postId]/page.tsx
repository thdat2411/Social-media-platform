import React from "react";
import FeedSideBar from "../../sidebar";
import PostMainContent from "./main-content";

const PostPage = () => {
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <FeedSideBar />
        <PostMainContent />
      </div>
    </div>
  );
};

export default PostPage;
