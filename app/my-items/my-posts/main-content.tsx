"use client";
import LinkIcon from "@/app/assets/link.png";
import PencilIcon from "@/app/assets/pencil.png";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { post, user } from "@prisma/client";
import { ChevronLeft, ChevronRight, Earth, Ellipsis } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type posts = post & { user: user | null };

interface SavedPostMainContentProps {
  posts: posts[];
}

const MyPostsMainContent = ({ posts }: SavedPostMainContentProps) => {
  const router = useRouter();
  const [currentPosts, setCurrentPosts] = useState<posts[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPagePosts = currentPosts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(currentPosts.length / pageSize);
  const maxPagesToShow = 3;

  useEffect(() => {
    setCurrentPosts(posts);
  }, [posts]);

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
          className={`h-fit rounded-full px-4 text-center hover:bg-blue-500 hover:text-white ${
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
    <div className="ml-8 w-1/2 rounded-lg border">
      <div className="flex flex-col">
        <div className="bg-white">
          <p className="p-7 text-2xl font-medium">My Posts</p>
        </div>
        <Separator />
        {currentPagePosts.map((post) => (
          <>
            <div key={post.id} className="flex cursor-pointer bg-white p-6">
              <div className="flex w-[90%] flex-col justify-between">
                <div
                  className="flex"
                  onClick={() => router.push(`/feed/post/${post.id}`)}
                >
                  <Avatar className="size-12">
                    <AvatarImage
                      src={post.user!.image ?? ""}
                      className="rounded-full"
                    />
                    <AvatarFallback className="size-12 bg-blue-300 text-xl font-medium text-white">
                      {post.user!.name.split(" ").pop()?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex flex-col">
                    <p className="text-sm font-semibold hover:underline">
                      {post.user?.name}
                    </p>
                    <p className="text-xs">{post.user?.headline}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <p>
                        {post.created_at
                          ? formatDate(new Date(post.created_at))
                          : "Unknown date"}{" "}
                        ∙{" "}
                      </p>
                      <Earth className="ml-2 size-4" />
                    </div>
                  </div>
                </div>
                <p
                  className="mt-6 line-clamp-3 text-sm"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {post.content}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="">
                  <Button
                    variant="ghost"
                    className="rounded-full p-3 hover:bg-[#F4F2EE]"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute -right-6 flex w-[200px] flex-col items-center justify-start">
                  <Button
                    onClick={() =>
                      router.push(`/feed/post/${post.id}?isEdit=true`)
                    }
                    variant="ghost"
                    className="flex w-full items-center justify-start space-x-2"
                  >
                    <Image src={PencilIcon} alt="" className="size-5" />
                    <p>Edit</p>
                  </Button>
                  <Button
                    onClick={() => copyLink(post.id)}
                    variant="ghost"
                    className="flex w-full items-center justify-start space-x-2"
                  >
                    <Image src={LinkIcon} alt="" className="size-5" />
                    <p>Copy link</p>
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
          </>
        ))}
        <div className="my-4 flex items-center justify-center space-x-7">
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
            disabled={currentPage === Math.ceil(currentPosts.length / pageSize)}
          >
            <p>Next</p>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyPostsMainContent;
