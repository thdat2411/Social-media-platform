"use client";
import { formatDate, Posts } from "@/app/utils/utils";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Image from "next/image";
import { Earth, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaBookmark, FaLink } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SavedPostMainContent = () => {
  const posts = Posts;
  const router = useRouter();
  const copyLink = (postId: string) => {
    const url = `${window.location.origin}/feed/post/${postId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link to clipboard");
      });
  };
  return (
    <div className="w-1/2 ml-8 border rounded-lg">
      <div className="flex flex-col">
        <div className="bg-[#F9FAFB]">
          <p className="font-medium text-2xl p-7">Saved Posts</p>
        </div>
        <Separator />
        {posts.map((post) => (
          <>
            <div key={post.id} className="flex p-6 cursor-pointer">
              <div className="flex flex-col justify-between w-full">
                <div
                  className="flex"
                  onClick={() => router.push(`/feed/post/${post.id}`)}
                >
                  <Image
                    alt=""
                    src="https://github.com/shadcn.png"
                    width={60}
                    height={60}
                  />
                  <div className="flex flex-col ml-3">
                    <p className="font-semibold hover:underline">
                      {post.author}
                    </p>
                    <p className="text-sm">{post.title}</p>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <p>{formatDate(post.date)} ∙ </p>
                      <Earth className="size-4 ml-2" />
                    </div>
                  </div>
                </div>
                <p className="mt-6">{post.content}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="">
                  <Button
                    variant="ghost"
                    className="rounded-full hover:bg-[#F4F2EE] p-3 "
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col items-center justify-start w-[200px] absolute -right-6">
                  <Button
                    onClick={() => {}}
                    variant="ghost"
                    className="w-full flex items-center justify-start space-x-2"
                  >
                    <FaBookmark />
                    <p>Unsave</p>
                  </Button>
                  <Button
                    onClick={() => copyLink(post.id)}
                    variant="ghost"
                    className="w-full flex items-center justify-start space-x-2"
                  >
                    <FaLink />
                    <p>Copy link</p>
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
          </>
        ))}
      </div>
    </div>
  );
};

export default SavedPostMainContent;
