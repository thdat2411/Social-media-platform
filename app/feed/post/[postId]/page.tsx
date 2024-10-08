import React from "react";
import FeedSideBar from "../../sidebar";
import PostMainContent from "./main-content";

const PostPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <FeedSideBar />
        <PostMainContent />
      </div>
    </div>
  );
};

export default PostPage;
