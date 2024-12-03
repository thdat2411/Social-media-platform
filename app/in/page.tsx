import getCurrentUser from "@/app/actions/getCurrentUser";
import getCurrentUserPosts from "@/app/actions/getCurrentUserPosts";
import getUsers from "@/app/actions/getUsers";
import React from "react";
import MyItemsFooter from "../my-items/footer";
import UserProfileMainContent from "./main-content";
const UserProfilePage = async () => {
  const currentUser = await getCurrentUser();
  const users = await getUsers();
  return (
    <div className="flex h-fit w-full justify-center p-4">
      <div className="w-[65%] pb-7 max-[1669px]:w-[75%] max-[1400px]:w-[85%]">
        <UserProfileMainContent users={users} user={currentUser!} />
      </div>
    </div>
  );
};

export default UserProfilePage;
