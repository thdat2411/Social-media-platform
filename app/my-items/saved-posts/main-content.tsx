"use client";
import { formatDate, Posts } from "@/app/utils/utils";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Earth, Ellipsis } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPagePosts = posts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(posts.length / pageSize);
  const maxPagesToShow = 3;

  const handlePageChange = (newPage: React.SetStateAction<number>) => {
    setCurrentPage(newPage);
  };
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
  const getPageButtons = () => {
    const pageButtons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 text-center h-fit rounded-full hover:bg-blue-500 hover:text-white ${
            i === currentPage
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-white text-gray-600"
          }`}
        >
          <p className="text-sm">{i}</p>
        </Button>
      );
    }

    return pageButtons;
  };
  return (
    <div className="w-1/2 ml-8 border rounded-lg">
      <div className="flex flex-col">
        <div className="bg-[#F9FAFB]">
          <p className="font-medium text-2xl p-7">Saved Posts</p>
        </div>
        <Separator />
        {currentPagePosts.map((post) => (
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
        <div className="flex justify-center space-x-7 my-4 items-center">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
            <p>Previous</p>
          </Button>
          {getPageButtons()}
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(posts.length / pageSize)}
          >
            <p>Next</p>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedPostMainContent;
