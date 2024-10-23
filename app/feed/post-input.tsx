"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GoFileMedia } from "react-icons/go";
import { MdCalendarMonth } from "react-icons/md";
import { defaultEvent } from "../utils/utils";
import { Event } from "./components/post-modal";
import { user } from "@prisma/client";

interface PostInputProps {
  setIsPostModalOpen: (open: boolean) => void;
  setIsImageModalOpen: (open: boolean) => void;
  setIsEventModalOpen: (open: boolean) => void;
  draftContent?: string | null;
  setFormData: (data: Event | undefined) => void;
  setNestedMediaModal: (open: boolean) => void;
  setNestedEventModal: (open: boolean) => void;
  user: user;
}

const PostInput = ({
  setIsPostModalOpen,
  setIsImageModalOpen,
  setIsEventModalOpen,
  draftContent,
  setFormData,
  setNestedMediaModal,
  setNestedEventModal,
  user,
}: PostInputProps) => {
  const avatarFallBack = user.name.split(" ").pop()?.charAt(0).toUpperCase();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border-[1.5px] border-[#DADEE2]">
      <div className="flex items-center space-x-2">
        <Avatar className="size-14">
          <AvatarImage src={user.image!} />
          <AvatarFallback className="bg-blue-300 text-white text-xl">
            {avatarFallBack}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="flex w-full rounded-full items-center justify-start h-12 border-slate-800 text-slate-500 overflow-x-auto overflow-hidden"
          onClick={() => setIsPostModalOpen(true)}
          onBlur={() => setIsPostModalOpen(false)}
        >
          <p>
            {draftContent === null ? "Start a post" : `Draft: ${draftContent}`}
          </p>
        </Button>
      </div>
      <div className="flex mt-4 justify-around flex-wrap">
        <Button
          onClick={() => {
            setIsImageModalOpen(true);
            setNestedMediaModal(false);
          }}
          onBlur={() => setIsImageModalOpen(false)}
          variant="ghost"
          className="bg-white text-gray-700 py-2 px-4 rounded-lg space-x-2 mr-2 hover:scale-110 transition-all"
        >
          <GoFileMedia className="size-6" color="#378FE9" />
          <p>Media</p>
        </Button>
        <Button
          onClick={() => {
            setFormData?.(defaultEvent);
            setNestedEventModal(false);
            setIsEventModalOpen(true);
          }}
          variant="ghost"
          className="bg-white text-gray-700 py-2 px-4 rounded-lg space-x-2  mr-2 hover:scale-110 transition-all"
        >
          <MdCalendarMonth className="size-6" color="#C37D16" />
          <p>Event</p>
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
