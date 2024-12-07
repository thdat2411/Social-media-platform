"use client";
import ApplicationImage from "@/app/assets/application.png";
import TransferImage from "@/app/assets/details.png";
import EyeIcon from "@/app/assets/eye.png";
import NoItemsImage from "@/app/assets/my-items-no-post.svg";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { job_application, job_posting } from "@prisma/client";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type application = {
  id: string;
  created_at: Date | null;
  job_listing_id: string | null;
  resume_url: string | null;
  job_listings: {
    user: {
      name: string;
      image: string | null;
    } | null;
    title: string;
  } | null;
  cover_letter: string | null;
};

interface MyApplicationMainContentProps {
  applications: application[];
}
{
}
const MyApplicationMainContent = ({
  applications,
}: MyApplicationMainContentProps) => {
  const router = useRouter();
  const [currentApplications, setCurrentApplications] = useState<application[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageApplications = currentApplications.slice(
    startIndex,
    endIndex
  );

  const [totalPages, setTotalPages] = useState<number>(0);
  const maxPagesToShow = 3;

  useEffect(() => {
    setCurrentApplications(applications);
    setTotalPages(Math.ceil(applications.length / pageSize));
  }, [applications]);

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
    <div className="ml-8 w-1/2 rounded-lg border bg-white max-[1400px]:w-[65%] max-[1200px]:w-[55%] max-[900px]:w-[65%] max-[750px]:ml-0 max-[750px]:w-[80%]">
      <div className="flex flex-col">
        <div className="bg-white">
          <p className="p-7 text-2xl font-medium max-[1200px]:text-xl">
            My Posts
          </p>
        </div>
        <Separator />
        {currentApplications.length > 0 ? (
          currentPageApplications.map((application) => {
            return (
              <>
                <div
                  key={application.id}
                  className="flex cursor-pointer bg-white p-6"
                >
                  <div
                    className="flex w-[90%] flex-col justify-between"
                    onClick={() => router.push(`/feed/post/${application.id}`)}
                  >
                    <div className="flex">
                      <Image
                        src={ApplicationImage}
                        alt=""
                        className="size-16"
                      />
                      <div className="ml-3 flex flex-col space-y-2">
                        <p className="text-xl font-semibold">
                          {application.job_listings?.title}
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <p>posted by</p>
                          <div className="flex items-center space-x-1">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={
                                  application?.job_listings?.user?.image ?? ""
                                }
                                className="rounded-full"
                              />
                              <AvatarFallback className="size-8 bg-blue-300 text-base font-medium text-white">
                                {application?.job_listings?.user?.name
                                  .split(" ")
                                  .pop()
                                  ?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-lg font-medium">
                              {application.job_listings?.user?.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs">
                          applied{" "}
                          {application.created_at
                            ? formatDate(new Date(application.created_at))
                            : ""}
                        </p>
                      </div>
                    </div>
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
                          router.push(
                            `/manage-applications?id=${application.id}`
                          )
                        }
                        variant="ghost"
                        className="flex w-full items-center justify-start space-x-2"
                      >
                        <Image src={EyeIcon} alt="" className="size-5" />
                        <p>View details</p>
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(
                            `/jobs/view/${application.job_listing_id}`
                          )
                        }
                        variant="ghost"
                        className="flex w-full items-center justify-start space-x-2"
                      >
                        <Image src={TransferImage} alt="" className="size-5" />
                        <p>Go to post</p>
                      </Button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Separator />
              </>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <Image src={NoItemsImage} alt="" />
            <p className="text-2xl font-medium">No application found</p>
          </div>
        )}
        {currentApplications.length > 0 && (
          <div className="flex items-center justify-center space-x-7 bg-white py-4">
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
              disabled={
                currentPage === Math.ceil(currentApplications.length / pageSize)
              }
            >
              <p>Next</p>
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationMainContent;
