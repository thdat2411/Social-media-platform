import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import FeedSideBar from "../../sidebar";
import SinglePostMainContent from "./main-content";

const PostPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="relative flex h-full w-full justify-center">
      <div className="mt-4 flex w-[60%] justify-start max-[1669px]:w-[70%] max-[1669px]:justify-center max-[1440px]:w-[80%] max-[1000px]:w-[85%]">
        <div className="flex h-fit w-1/5 flex-col space-y-4 max-[1000px]:w-1/3">
          <FeedSideBar user={user!} />
        </div>
        <SinglePostMainContent user={user!} />
      </div>
    </div>
  );
};

export default PostPage;
