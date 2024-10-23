"use client";
import { formatDate, Posts } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Earth, MessageSquareMore, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import CommentInput from "../../comment-input";

const PostMainContent = () => {
  const postId = useParams().postId as string;
  const post = Posts.find((post) => post.id === postId);
  const words = post!.content.split(" ");
  const shouldTruncate = words.length > 20;
  const [showCommentInput, setShowCommentInput] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  //   const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showFullText, setShowFullText] = useState(false);
  const textareaRef = useRef(null);
  // const handleCommentSubmit = () => {
  //   // if (commentText.trim()) {
  //   //   setComments([...comments, commentText]);
  //   //   setCommentText("");
  //   //   setShowCommentInput(false); // Optionally hide the input after submitting
  //   // }
  // };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault(); // Prevent default Enter key behavior (newline)
  //     handleCommentSubmit();
  //   }
  // };
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
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImageUrl("");
    setCommentText(commentText.replace(/!\[Image\]\((.*?)\)/, ""));
  };

  useEffect(() => {
    if (textareaRef.current && commentText.trim().length > 0) {
      (textareaRef.current as HTMLTextAreaElement).focus();
      (textareaRef.current as HTMLTextAreaElement).setSelectionRange(
        commentText.length,
        commentText.length
      );
    }
  }, [commentText]);

  return (
    <div className="ml-8 h-fit w-1/2 rounded-lg border-[1.5px] border-[#DADEE2] bg-white p-4 shadow-sm">
      <Link
        href="#"
        className="mb-4 flex cursor-pointer items-center space-x-2"
      >
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="size-14"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold hover:underline">{post!.author}</h3>
          <p className="text-sm text-gray-600">{post!.title}</p>
          <div className="flex items-center justify-start space-x-1">
            <p className="text-xs text-gray-600">
              {formatDate(post!.date)} <span className="text-lg">∙</span>
            </p>
            <Earth className="size-4" />
          </div>
        </div>
      </Link>
      <p className="mb-6 text-gray-700">
        {showFullText || !shouldTruncate ? (
          post!.content
        ) : (
          <>
            {words.slice(0, 20).join(" ")} ...
            <button
              className="cursor-pointer text-gray-400 hover:text-blue-500 hover:underline"
              onClick={() => setShowFullText(true)}
            >
              Read more
            </button>
          </>
        )}
      </p>
      {post!.image && (
        <Image
          src="https://github.com/shadcn.png"
          alt=""
          width={600}
          height={100}
          className="object-cover"
        />
      )}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex">
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-gray-400">
            <AiOutlineLike className="size-4" color="white" />
          </div>
          <span className="ml-1 flex items-center text-sm">299</span>
        </div>
        <button
          onClick={() => setShowCommentInput(true)}
          className="cursor-pointer text-sm text-gray-400 hover:text-blue-600 hover:underline"
        >
          6 comments
        </button>
      </div>
      <Separator className="mt-2" />
      <div className="mt-2 flex items-center justify-around">
        <Button
          onClick={() => {}}
          variant="ghost"
          className="mr-4 flex items-center"
        >
          <AiOutlineLike className="size-6" />
          <span className="ml-1 text-base">Like</span>
        </Button>
        <Button
          onClick={() => setShowCommentInput(!showCommentInput)}
          variant="ghost"
          className="mr-4 flex items-center"
        >
          <MessageSquareMore className="size-6" />
          <span className="ml-1 text-base">Comment</span>
        </Button>
        <Button
          onClick={() => {}}
          variant="ghost"
          className="mr-4 flex items-center"
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

export default PostMainContent;
