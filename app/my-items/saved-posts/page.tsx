import React from "react";
import PostedSidebar from "../posted-sidebar";
import SavedPostMainContent from "./main-content";

const SavedPostsPage = () => {
  return (
    <div className="relative">
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <PostedSidebar />
        <SavedPostMainContent />
      </div>
    </div>
  );
};

export default SavedPostsPage;
