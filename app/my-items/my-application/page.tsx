import getCurrentUser from "@/app/actions/getCurrentUser";
import getApplications from "@/app/actions/getCurrentUserApplication";
import getCurrentUserPosts from "@/app/actions/getCurrentUserPosts";
import React from "react";
import MyItemsFooter from "../footer";
import PostedSidebar from "../posted-sidebar";
import MyApplicationMainContent from "./main-content";

const MyApplicationPage = async () => {
  const user = await getCurrentUser();
  const applications = await getApplications();
  return (
    <div className="relative flex w-full justify-center">
      <div className="flex h-[90%] w-[60%] flex-col justify-between overflow-hidden max-[1600px]:w-[70%] max-[1400px]:w-[75%] max-[1200px]:w-[80%] max-[900px]:w-[90%]">
        <div className="mt-4 flex w-full justify-start max-[1669px]:justify-center max-[750px]:flex-col max-[750px]:items-center max-[750px]:space-y-2">
          <PostedSidebar user={user!} />
          <MyApplicationMainContent applications={applications!} />
        </div>
        <MyItemsFooter />
      </div>
    </div>
  );
};

export default MyApplicationPage;
