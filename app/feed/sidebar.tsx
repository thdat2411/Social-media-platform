import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import React from "react";

const FeedSideBar = () => {
  return (
    <aside className="w-1/4 bg-white border border-[#DADEE2] rounded-lg shadow-sm h-fit">
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
  );
};

export default FeedSideBar;
