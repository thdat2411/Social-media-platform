"use client";
import CalendarImage from "@/app/assets/calendar-hover.png";
import PictureImage from "@/app/assets/picture-hover.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultEvent } from "../utils/utils";
import { Event } from "./components/post-modal";

interface PostInputProps {
  draftContent: string | null;
  setIsPostModalOpen: (open: boolean) => void;
  setIsImageModalOpen: (open: boolean) => void;
  setIsEventModalOpen: (open: boolean) => void;
  setFormData: (data: Event | undefined) => void;
  setNestedMediaModal: (open: boolean) => void;
  setNestedEventModal: (open: boolean) => void;
  user: user;
}

const PostInput = ({
  draftContent,
  setIsPostModalOpen,
  setIsImageModalOpen,
  setIsEventModalOpen,
  setFormData,
  setNestedMediaModal,
  setNestedEventModal,
  user,
}: PostInputProps) => {
  return (
    <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white p-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <Avatar className="size-14">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-blue-300 text-xl text-white">
            {user?.name.split(" ").pop()?.charAt(0).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-start overflow-hidden overflow-x-auto rounded-full border-slate-800 text-slate-500"
          onClick={() => setIsPostModalOpen(true)}
          onBlur={() => setIsPostModalOpen(false)}
        >
          <p className="overflow-hidden">
            {draftContent === null ? "Start a post" : `Draft: ${draftContent}`}
          </p>
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap justify-around">
        <Button
          onClick={() => {
            setIsImageModalOpen(true);
            setNestedMediaModal(false);
          }}
          onBlur={() => setIsImageModalOpen(false)}
          variant="ghost"
          className="mr-2 space-x-2 rounded-lg bg-white px-4 py-2 text-gray-700 transition-all hover:scale-110"
        >
          <Image src={PictureImage} alt="" className="size-6" />
          <p>Media</p>
        </Button>
        <Button
          onClick={() => {
            setFormData?.(defaultEvent);
            setNestedEventModal(false);
            setIsEventModalOpen(true);
          }}
          variant="ghost"
          className="mr-2 space-x-2 rounded-lg bg-white px-4 py-2 text-gray-700 transition-all hover:scale-110"
        >
          <Image src={CalendarImage} alt="" className="size-5" />
          <p>Event</p>
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
