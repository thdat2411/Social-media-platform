import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaImage, FaRegSmile } from "react-icons/fa";
import { EmojiPopover } from "../components/emoji-popover";

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
  const inputClass = `flex w-full items-center py-1 px-4 border-2 border-gray-300 rounded-full ${
    isFocused ? "border-gray-500" : ""
  }`;
  const textareaClass = `flex flex-col w-full py-1 px-2 border-2 border-gray-300 rounded-2xl ${
    isFocused ? "border-gray-500" : ""
  }`;

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commentText.trim().length === 0 && !imageUrl && inputRef.current) {
      inputRef.current.focus();
    } else if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [commentText, imageUrl]); // TODO: Fix "React Hook useEffect has a missing dependency: 'textareaRef'."

  const renderInputField = () => (
    <div className={inputClass}>
      <input
        ref={inputRef}
        className="w-full outline-none"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <EmojiPopover onEmojiSelect={handleEmojiSelect}>
        <Button variant="ghost" className="rounded-full">
          <FaRegSmile className="size-5 cursor-pointer text-gray-500 hover:text-gray-800" />
        </Button>
      </EmojiPopover>
      <label
        htmlFor="imageUpload"
        className="group cursor-pointer rounded-full p-3 hover:bg-gray-100"
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
  );

  const renderTextareaField = () => (
    <div className={textareaClass}>
      <textarea
        ref={textareaRef}
        className="w-full resize-none px-4 outline-none"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
      />
      {imageUrl && (
        <div className="relative mt-2 flex items-center px-4">
          <Image
            src={imageUrl}
            alt="Selected"
            className="mr-2 rounded-lg object-cover"
            width={160}
            height={160}
          />
          <Button
            onClick={removeImage}
            className="absolute left-32 top-2 w-fit rounded-full bg-black p-3 hover:bg-black"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <div className="my-2 flex justify-between">
        <div className="flex items-center space-x-2">
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <Button variant="ghost" className="group rounded-full">
              <FaRegSmile className="size-5 cursor-pointer text-gray-500 group-hover:text-gray-800" />
            </Button>
          </EmojiPopover>
          {!imageUrl && renderImageUpload()}
        </div>
        <Button variant="ghost" type="submit" className="p-3c rounded-full">
          <SendHorizontal className="size-5" />
        </Button>
      </div>
    </div>
  );

  const renderImageUpload = () => (
    <>
      <label
        htmlFor="imageUpload"
        className="group cursor-pointer rounded-full p-3 hover:bg-gray-100"
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
  );

  return (
    <div className="mt-4 flex items-center space-x-2">
      <Avatar>
        <AvatarImage
          src="https://github.com/shadcn.png"
          className="size-11 rounded-full"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {commentText.trim().length === 0 && !imageUrl
        ? renderInputField()
        : renderTextareaField()}
    </div>
  );
};

export default CommentInput;
