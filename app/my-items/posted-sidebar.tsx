"use client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBookmark } from "react-icons/fa";

const PostedSidebar = () => {
  const pathName = usePathname();
  return (
    <aside className=" w-1/4 rounded-lg shadow-sm h-fit border">
      <div className="flex flex-col">
        <div className="flex space-x-4 items-center text-[#666666] bg-[#F9FAFB] p-4 ">
          <FaBookmark />
          <p>My items</p>
        </div>
        <Separator />
        <Link
          href="/my-items/posted-jobs"
          className={`py-3 px-4  ${
            pathName === "/my-items/posted-jobs"
              ? "border-l-4 border-l-blue-600 text-blue-600"
              : "text-[#666666] hover:text-black"
          } `}
        >
          Posted jobs
        </Link>
        <Separator />
        <Link
          href="/my-items/saved-posts"
          className={`py-3 px-4  ${
            pathName === "/my-items/saved-posts"
              ? "border-l-4 border-l-blue-600 text-blue-600"
              : "text-[#666666] hover:text-black"
          } `}
        >
          Save posts and articles
        </Link>
      </div>
    </aside>
  );
};

export default PostedSidebar;
