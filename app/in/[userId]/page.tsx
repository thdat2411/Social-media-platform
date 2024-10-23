import getCurrentUser from "@/app/actions/getCurrentUser";
import getCurrentUserPosts from "@/app/actions/getCurrentUserPosts";
import React from "react";
import UserProfileMainContent from "./main-content";
const UserProfilePage = async () => {
  const user = await getCurrentUser();
  const posts = await getCurrentUserPosts();
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-6xl">
        <UserProfileMainContent user={user!} userPosts={posts!} />
      </div>
    </div>
  );
};

export default UserProfilePage;
