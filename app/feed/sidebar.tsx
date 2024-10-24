import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { BsFillCalendar2EventFill } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";

interface FeedSideBarProps {
  user: user;
}

const FeedSideBar = ({ user }: FeedSideBarProps) => {
  const avatarFallBack = user.name.split(" ").pop()?.charAt(0).toUpperCase();
  return (
    <div className="flex flex-col space-y-4 max-[1200px]:w-1/3 max-[700px]:w-full min-[1200px]:w-1/4">
      <aside className="h-fit rounded-lg border bg-[#F9FAFB] shadow-sm">
        <div className="flex flex-col">
          <div className="h-fit">
            <Separator className="h-16 rounded-tl-lg rounded-tr-lg border-b bg-slate-600" />
            <Avatar className="-top-7 ml-4 size-24">
              <AvatarImage src={user.image!} />
              <AvatarFallback className="bg-blue-300 text-3xl text-white">
                {avatarFallBack}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="-mt-5 px-4 pb-4">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.bio}</p>
          <p className="text-sm text-gray-600">{user.location}</p>
          <p className="mt-2 text-sm text-gray-600">
            HCMC University of Technology and Education
          </p>
        </div>
      </aside>
      <aside className="h-fit space-y-4 rounded-lg border bg-[#F9FAFB] p-6 shadow-sm">
        <Link
          href="/my-items/posted-jobs"
          className="flex items-center space-x-3"
        >
          <FaBookmark />
          <p className="cursor-pointer text-sm hover:underline">Saved Items</p>
        </Link>
        <div className="flex items-center space-x-3">
          <BsFillCalendar2EventFill className="size-4" />
          <p className="cursor-pointer text-sm hover:underline">Event</p>
        </div>
      </aside>
    </div>
  );
};

export default FeedSideBar;
