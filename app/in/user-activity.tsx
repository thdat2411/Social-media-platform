"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { formatDate, Posts } from "../utils/utils";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { MoveRight } from "lucide-react";

interface UserActivityProps {
  setIsPostModalOpen: (value: boolean) => void;
}

const UserActivity = ({ setIsPostModalOpen }: UserActivityProps) => {
  const router = useRouter();
  return (
    <div className=" bg-white rounded-lg border shadow-md mt-6">
      <div className="flex justify-between items-center px-5 py-6">
        <p className="text-xl font-semibold">Activity</p>
        <Button
          onClick={() => setIsPostModalOpen(true)}
          variant="outline"
          className="border-2 border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700 rounded-full"
        >
          <p className="font-semibold">Create a post</p>
        </Button>
      </div>
      <div className="flex flex-col px-5">
        {Posts.slice(0, 3).map((post, index) => (
          <>
            <div
              onClick={() => router.push(`/feed/post/${post.id}`)}
              key={post.id}
              className="w-full flex flex-col text-sm cursor-pointer"
            >
              <p className="text-[#666666]">
                <span className="font-semibold">User</span> posted this ∙{" "}
                {formatDate(post.date)}
              </p>
              <p>{post.content}</p>
            </div>
            {index < 2 && <Separator className="my-4 " />}
          </>
        ))}
      </div>
      <Separator className="mt-4" />
      <Button
        variant="ghost"
        className="rounded-b-lg rounded-l-none rounded-r-none w-full space-x-3"
      >
        <p className="text-base">Show all posts</p>
        <MoveRight />
      </Button>
    </div>
  );
};

export default UserActivity;
