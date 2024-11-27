"use client";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";

interface PostedSidebarProps {
  user: user;
}

const PostedSidebar = ({ user }: PostedSidebarProps) => {
  const pathName = usePathname();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    setUserRole(user.role ?? "");
  }, [user]);

  return (
    <aside className="h-fit w-1/4 rounded-lg border shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center space-x-4 bg-[#F9FAFB] p-4 text-[#666666]">
          <FaBookmark />
          <p>My items</p>
        </div>
        <Separator />
        <Link
          href="/my-items/my-posts"
          className={`bg-white px-4 py-3 ${
            pathName === "/my-items/my-posts"
              ? "border-l-4 border-l-blue-600 text-blue-600"
              : "text-[#666666] hover:text-black"
          } `}
        >
          My posts
        </Link>
        {userRole === "recruiter" && (
          <Link
            href="/my-items/posted-jobs"
            className={`bg-white px-4 py-3 ${
              pathName === "/my-items/posted-jobs"
                ? "border-l-4 border-l-blue-600 text-blue-600"
                : "text-[#666666] hover:text-black"
            } `}
          >
            Job postings
          </Link>
        )}
        <Separator />
        <Link
          href="/my-items/saved-posts"
          className={`bg-white px-4 py-3 ${
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
