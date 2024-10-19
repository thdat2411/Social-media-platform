import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { FaBookmark } from "react-icons/fa";
import { BsFillCalendar2EventFill } from "react-icons/bs";
import Link from "next/link";

const FeedSideBar = () => {
  return (
    <div className="flex flex-col min-[1200px]:w-1/4 max-[1200px]:w-1/3 max-[700px]:w-full space-y-4">
      <aside className=" bg-[#F9FAFB]  rounded-lg shadow-sm h-fit border">
        <div className="flex flex-col">
          <div className="h-fit">
            <Separator className="h-16 border-b rounded-tl-lg rounded-tr-lg bg-slate-600" />
            <Avatar className="size-24 ml-4 -top-7">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-4 -mt-5 pb-4">
          <h2 className="text-lg font-semibold">Thái Đạt</h2>
          <p className="text-sm text-gray-600">
            Student at HCMC University of Technology and Education
          </p>
          <p className="text-sm text-gray-600">Thủ Đức, Ho Chi Minh City</p>
          <p className="text-sm text-gray-600 mt-2">
            HCMC University of Technology and Education
          </p>
        </div>
      </aside>
      <aside className="bg-[#F9FAFB]  rounded-lg shadow-sm h-fit p-6 space-y-4 border">
        <Link
          href="/my-items/posted-jobs"
          className="flex space-x-3 items-center"
        >
          <FaBookmark />
          <p className="text-sm hover:underline cursor-pointer">Saved Items</p>
        </Link>
        <div className="flex space-x-3 items-center">
          <BsFillCalendar2EventFill className="size-4" />
          <p className="text-sm hover:underline cursor-pointer">Event</p>
        </div>
      </aside>
    </div>
  );
};

export default FeedSideBar;
