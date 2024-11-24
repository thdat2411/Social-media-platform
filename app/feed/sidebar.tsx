"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HoverableIcon from "../components/hoverable-icon";

interface FeedSideBarProps {
  user: user;
}

const FeedSideBar = ({ user }: FeedSideBarProps) => {
  // const avatarFallBack = user.name.split(" ").pop()?.charAt(0).toUpperCase();
  const [isBookMarkHovered, setIsBookMarkHovered] = useState(false);
  const [isEventHovered, setIsEventHovered] = useState(false);
  const [currentUser, setCurrentUser] = useState<user | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
  return (
    <>
      <aside className="h-fit rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col">
          <div className="h-fit">
            <Separator className="h-16 rounded-tl-lg rounded-tr-lg border-b bg-slate-600" />
            <Avatar className="-top-7 ml-4 size-20">
              <AvatarImage src={currentUser?.image || ""} />
              <AvatarFallback className="bg-blue-300 text-3xl text-white">
                {currentUser?.name.split(" ").pop()?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="-mt-5 px-4 pb-4">
          <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
          <p className="text-sm text-gray-600">{currentUser?.bio}</p>
          <p className="text-sm text-gray-600">{currentUser?.location}</p>
          <p className="mt-2 text-sm text-gray-600">
            HCMC University of Technology and Education
          </p>
        </div>
      </aside>
      <aside className="h-fit space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <Link
          href="/my-items/posted-jobs"
          className="flex items-center space-x-3"
          onMouseEnter={() => setIsBookMarkHovered(true)}
          onMouseLeave={() => setIsBookMarkHovered(false)}
        >
          <HoverableIcon
            iconHover="/bookmark.mp4"
            isHovered={isBookMarkHovered}
            className="size-7"
          />
          <p className="cursor-pointer text-sm hover:underline">Saved Items</p>
        </Link>
        <div
          className="flex items-center space-x-3"
          onMouseEnter={() => setIsEventHovered(true)}
          onMouseLeave={() => setIsEventHovered(false)}
        >
          <HoverableIcon
            iconHover="/event.mp4"
            isHovered={isEventHovered}
            className="size-7"
          />
          <p className="cursor-pointer text-sm hover:underline">Event</p>
        </div>
      </aside>
    </>
  );
};

export default FeedSideBar;
