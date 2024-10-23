import React from "react";
import PostedSidebar from "../posted-sidebar";
import SavedPostMainContent from "./main-content";

const SavedPostsPage = () => {
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar />
        <SavedPostMainContent />
      </div>
    </div>
  );
};

export default SavedPostsPage;
