import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import PostedSidebar from "../posted-sidebar";
import SavedPostMainContent from "./main-content";

const SavedPostsPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <PostedSidebar user={user!} />
        <SavedPostMainContent />
      </div>
    </div>
  );
};

export default SavedPostsPage;
