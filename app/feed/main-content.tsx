"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { GoFileMedia } from "react-icons/go";
import { MdCalendarMonth } from "react-icons/md";
import { SiLibreofficewriter } from "react-icons/si";
import PostModal from "./post-modal";
import Post from "./post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostInput from "./post-input";

const FeedMainContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  return (
    <>
      <PostModal open={isPostModalOpen} setOpen={setIsPostModalOpen} />
      <div className="w-1/2 mx-4">
        <PostInput setIsPostModalOpen={() => setIsPostModalOpen(true)} />
        <Post />
      </div>
    </>
  );
};

export default FeedMainContent;
