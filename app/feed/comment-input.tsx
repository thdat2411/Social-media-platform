import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { EmojiPopover } from "../components/emoji-popover";
import { Button } from "@/components/ui/button";
import { FaImage, FaRegSmile } from "react-icons/fa";
import { X } from "lucide-react";
import Image from "next/image";

interface CommentInputProps {
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  imageUrl: string | null;
  handleEmojiSelect: (emoji: string) => void;
  handleImageUpload: React.ChangeEventHandler<HTMLInputElement>;
  removeImage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const CommentInput = ({
  commentText,
  setCommentText,
  isFocused,
  setIsFocused,
  imageUrl,
  handleEmojiSelect,
  handleImageUpload,
  removeImage,
  textareaRef,
}: CommentInputProps) => {
  return (
    <div className="mt-4 flex space-x-2 items-center ">
      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          className="size-11 rounded-full"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {commentText.trim().length === 0 && !imageUrl ? (
        <div
          className={`flex w-full items-center py-1 px-4 border-2 border-gray-300 rounded-full${
            isFocused ? " border-gray-500" : ""
          }`}
        >
          <input
            className="w-full outline-none"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <Button variant="ghost" className="rounded-full">
              <FaRegSmile className="size-5 cursor-pointer  text-gray-500 hover:text-gray-800" />
            </Button>
          </EmojiPopover>
          <label
            htmlFor="imageUpload"
            className="cursor-pointer rounded-full p-3 hover:bg-gray-100 group"
          >
            <FaImage className="size-5 cursor-pointer text-gray-500 group-hover:text-gray-800" />
          </label>
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      ) : (
        <div
          className={`flex flex-col w-full py-1 px-2 border-2 border-gray-300 rounded-2xl${
            isFocused ? " border-gray-500" : ""
          }`}
        >
          <textarea
            ref={textareaRef}
            className="w-full outline-none resize-none px-4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
          />
          {imageUrl && (
            <div className="flex items-center mt-2 relative px-4">
              <Image
                src={imageUrl}
                alt="Selected"
                className="object-cover mr-2 rounded-lg"
                width={160}
                height={160}
              />
              <Button
                onClick={removeImage}
                className="rounded-full w-fit p-3 absolute top-2 left-32 bg-black hover:bg-black"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
          <div className="flex justify-between my-2">
            <div className="flex items-center space-x-2">
              <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                <Button variant="ghost" className="rounded-full group">
                  <FaRegSmile className="size-5 cursor-pointer  text-gray-500 group-hover:text-gray-800" />
                </Button>
              </EmojiPopover>
              {!imageUrl && (
                <>
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer rounded-full p-3 hover:bg-gray-100 group"
                  >
                    <FaImage className="size-5 cursor-pointer text-gray-500 group-hover:text-gray-800" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="imageUpload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
            <Button
              type="submit"
              className="bg-[#0A66C2] hover:bg-blue-800 text-white"
            >
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
