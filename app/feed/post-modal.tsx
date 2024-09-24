import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { FaRegSmile } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Hint } from "../components/hint";
import { MdCalendarMonth, MdOutlinePermMedia } from "react-icons/md";
import { EmojiPopover } from "../components/emoji-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PostModal = ({ open, setOpen }: PostModalProps) => {
  const [postContent, setPostContent] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full max-w-2xl">
        <div className="bg-white border rounded-lg p-7 relative">
          <Button
            variant="ghost"
            className="flex items-center px-4 py-10 rounded-3xl"
          >
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="size-12"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ml-2 flex flex-col">
              <div className="font-semibold text-lg text-left">Thái Đạt</div>
              <div className="text-xs text-gray-500 flex">
                <span>Posted to anyone</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </Button>
          <textarea
            className=" w-full rounded-lg text-lg h-60 p-2 mt-4 focus:outline-none focus:border-transparent"
            placeholder="What do you want to say?"
            value={postContent}
            onChange={handleInputChange}
          />
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <Button variant="ghost" className="rounded-full w-fit">
              <FaRegSmile className="size-6 cursor-pointer  text-gray-500 hover:text-gray-800" />
            </Button>
          </EmojiPopover>
          <div className="flex items-center justify-start mt-7 ml-4 space-x-9 text-gray-500">
            <Hint label="Add a media">
              <div className="flex items-center space-x-4">
                <MdOutlinePermMedia className="size-6 cursor-pointer hover:text-gray-800" />
              </div>
            </Hint>
            <Hint label="Create an event">
              <div className="flex items-center space-x-4">
                <MdCalendarMonth className="size-6 cursor-pointer hover:text-gray-800" />
              </div>
            </Hint>
            <Hint label="Add a document">
              <div className="flex items-center space-x-4">
                <IoDocumentText className="size-6 cursor-pointer hover:text-gray-800" />
              </div>
            </Hint>
          </div>
          <div className="w-full border mt-4"></div>
          <div className="flex justify-end mt-5">
            <Button
              type="submit"
              disabled={true}
              className="bg-blue-500 text-white px-4 py-2 mr-4 rounded-full"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
