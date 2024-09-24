"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Earth, MessageSquareMore, Send, X } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CommentInput from "./comment-input";

// interface PostProps {

// }

const Post = () => {
  const articleText =
    "We’re hiring for a variety of exciting positions across multiple departments! If you're passionate about fintech, innovation and want to work at one of the country’s leading tech companies, now’s your chance to take the next step in your career journey with MoMo!";
  const words = articleText.split(" ");
  const shouldTruncate = words.length > 20;
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  //   const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showFullText, setShowFullText] = useState(false);
  const textareaRef = useRef(null);
  const handleCommentSubmit = () => {
    // if (commentText.trim()) {
    //   setComments([...comments, commentText]);
    //   setCommentText("");
    //   setShowCommentInput(false); // Optionally hide the input after submitting
    // }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter key behavior (newline)
      handleCommentSubmit();
    }
  };
  const handleEmojiSelect = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Append image to text
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImageUrl("");
    setCommentText(commentText.replace(/!\[Image\]\((.*?)\)/, "")); // Remove image placeholder from text
  };

  useEffect(() => {
    if (textareaRef.current && commentText.trim().length > 0) {
      // Set focus and cursor to the end when transitioning to textarea
      (textareaRef.current as HTMLTextAreaElement).focus();
      (textareaRef.current as HTMLTextAreaElement).setSelectionRange(
        commentText.length,
        commentText.length
      );
    }
  }, [commentText]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Link
        href="#"
        className="flex items-center mb-4 space-x-2 cursor-pointer"
      >
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="size-14"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-bold hover:underline">Anjali Tiwari</h3>
          <p className="text-sm text-gray-600">3rd+</p>
          <div className="flex space-x-1 items-center justify-start">
            <p className="text-sm text-gray-600">
              1d <span className="text-lg ">∙</span>
            </p>
            <Earth className="size-4" />
          </div>
        </div>
      </Link>
      <p className="text-sm text-gray-700 mb-4">
        {showFullText || !shouldTruncate ? (
          articleText
        ) : (
          <>
            {words.slice(0, 20).join(" ")} ...
            <button
              className="text-gray-400 cursor-pointer hover:underline hover:text-blue-500 "
              onClick={() => setShowFullText(true)}
            >
              Read more
            </button>
          </>
        )}
      </p>
      <div className="bg-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-bold">
          Python Basics. A Practical Introduction to Python 3.pdf - 98 pages
        </h3>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex">
          <div className="flex text-gray-400 rounded-full bg-blue-600 size-6 items-center justify-center">
            <AiOutlineLike className="size-4" color="white" />
          </div>
          <span className="text-sm ml-1 items-center flex">299</span>
        </div>
        <button
          onClick={() => setShowCommentInput(true)}
          className="text-gray-400 cursor-pointer hover:underline text-sm hover:text-blue-600"
        >
          6 comments
        </button>
      </div>
      <Separator className="mt-2" />
      <div className="flex items-center justify-around mt-2">
        <Button
          onClick={() => {}}
          variant="ghost"
          className="flex items-center mr-4"
        >
          <AiOutlineLike className="size-6" />
          <span className="ml-1 text-base">Like</span>
        </Button>
        <Button
          onClick={() => setShowCommentInput(true)}
          variant="ghost"
          className="flex items-center mr-4"
        >
          <MessageSquareMore className="size-6" />
          <span className="ml-1 text-base">Comment</span>
        </Button>
        <Button
          onClick={() => {}}
          variant="ghost"
          className="flex items-center mr-4"
        >
          <Send className="size-6" />
          <span className="ml-1 text-base">Send</span>
        </Button>
      </div>

      {showCommentInput && (
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          imageUrl={imageUrl}
          handleEmojiSelect={handleEmojiSelect}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          textareaRef={textareaRef}
        />
      )}
    </div>
  );
};

export default Post;
