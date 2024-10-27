"use client";
import CompanyImage from "@/app/assets/company.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { job_posting } from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Pencil,
  SquarePen,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface PostedJobsMainContentProps {
  jobPosts:job_posting[];
}

const PostedJobsMainContent = ({jobPosts}:PostedJobsMainContentProps) => {
  const postedJobs = jobPosts;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageJobs = postedJobs.slice(startIndex, endIndex);

  const totalPages = Math.ceil(postedJobs.length / pageSize);
  const maxPagesToShow = 3;

  const handlePageChange = (newPage: React.SetStateAction<number>) => {
    setCurrentPage(newPage);
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
    <>
      <div className="mx-4 w-1/2 space-y-5">
        <div className="ml-8 rounded-lg border p-7">
          <Button
            onClick={() => router.push("/job-posting")}
            variant="outline"
            className="w-full rounded-full border-2 border-blue-500 font-semibold hover:border-blue-700"
          >
            <div className="flex items-center justify-center space-x-3 text-blue-500">
              <SquarePen />
              <p className="text-base">Post a free job</p>
            </div>
          </Button>
        </div>
        <div className="ml-8 rounded-lg border">
          <div className="flex flex-col">
            <div className="bg-[#F9FAFB]">
              <p className="p-7 text-2xl font-medium">Posted Jobs</p>
            </div>
            <Separator />
            {currentPageJobs.map((job) => (
              <>
                <div key={job.id} className="flex p-6">
                  <Image
                    src={CompanyImage}
                    alt="company"
                    width={50}
                    height={50}
                    className=""
                  />
                  <div className="ml-3 flex w-full cursor-pointer justify-between">
                    <div className="flex flex-col">
                      <p className="font-semibold hover:underline">
                        {job.title}
                      </p>
                      <p className="text-sm font-light text-muted-foreground">
                        {job.location} ({job.workplace_type})
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
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
                            router.push(`/job-posting/edit/${job.id}`)
                          }
                          variant="ghost"
                          className="flex w-full items-center justify-start space-x-2"
                        >
                          <Pencil />
                          <p>Edit post</p>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex w-full items-center justify-start space-x-2"
                        >
                          <Trash2 />
                          <p>Delete post</p>
                        </Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                disabled={
                  currentPage === Math.ceil(postedJobs.length / pageSize)
                }
              >
                <p>Next</p>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostedJobsMainContent;
