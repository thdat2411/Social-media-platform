import getCurrentUser from "@/app/actions/getCurrentUser";
import getCurrentUserPosts from "@/app/actions/getCurrentUserPosts";
import getUsers from "@/app/actions/getUsers";
import React from "react";
import UserProfileMainContent from "./main-content";
const UserProfilePage = async () => {
  const user = await getCurrentUser();
  const posts = await getCurrentUserPosts();
  const users = await getUsers();
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-6xl pb-7">
        <UserProfileMainContent user={user!} userPosts={posts!} users={users} />
      </div>
    </div>
  );
};

export default UserProfilePage;
