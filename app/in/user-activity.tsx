"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { formatDate, Posts } from "../utils/utils";

interface UserActivityProps {
  setIsPostModalOpen: (value: boolean) => void;
}

const UserActivity = ({ setIsPostModalOpen }: UserActivityProps) => {
  const router = useRouter();
  return (
    <div className="mt-6 rounded-lg border bg-white shadow-md">
      <div className="flex items-center justify-between px-5 py-6">
        <p className="text-xl font-semibold">Activity</p>
        <Button
          onClick={() => setIsPostModalOpen(true)}
          variant="outline"
          className="rounded-full border-2 border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700"
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
              className="flex w-full cursor-pointer flex-col text-sm"
            >
              <p className="text-[#666666]">
                <span className="font-semibold">User</span> posted this ∙{" "}
                {formatDate(post.date)}
              </p>
              <p>{post.content}</p>
            </div>
            {index < 2 && <Separator className="my-4" />}
          </>
        ))}
      </div>
      <Separator className="mt-4" />
      <Button
        variant="ghost"
        className="w-full space-x-3 rounded-b-lg rounded-l-none rounded-r-none"
      >
        <p className="text-base">Show all posts</p>
        <MoveRight />
      </Button>
    </div>
  );
};

export default UserActivity;
