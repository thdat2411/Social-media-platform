import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import { GoFileMedia } from "react-icons/go";
import { MdCalendarMonth } from "react-icons/md";
import { SiLibreofficewriter } from "react-icons/si";

interface PostInputProps {
  setIsPostModalOpen: (open: boolean) => void;
}

const PostInput = ({ setIsPostModalOpen }: PostInputProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center space-x-2">
        <Avatar className="size-14">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="flex w-full rounded-full items-center justify-start h-12 border-slate-800 text-slate-500"
          onClick={() => setIsPostModalOpen(true)}
        >
          <p>Start a post</p>
        </Button>
      </div>
      <div className="flex mt-4 justify-around">
        <Button
          variant="ghost"
          className="bg-white text-gray-700 py-2 px-4 rounded-lg space-x-2 mr-2"
        >
          <GoFileMedia className="size-6" color="#378FE9" />
          <p>Media</p>
        </Button>
        <Button
          variant="ghost"
          className="bg-white text-gray-700 py-2 px-4 rounded-lg space-x-2  mr-2"
        >
          <MdCalendarMonth className="size-6" color="#C37D16" />
          <p>Event</p>
        </Button>
        <Button
          variant="ghost"
          className="bg-white text-gray-700 py-2 px-4 rounded-lg space-x-2 mr-2"
        >
          <SiLibreofficewriter className="size-6" color="#E06847" />
          <p>Write article</p>
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
