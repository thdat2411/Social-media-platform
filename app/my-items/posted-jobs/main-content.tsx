"use client";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import CompanyImage from "@/app/assets/company.png";
import Image from "next/image";
import { JobsPostList } from "@/app/utils/utils";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Pencil,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
const PostedJobsMainContent = () => {
  const postedJobs = JobsPostList;
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
    <>
      <div className="w-1/2 mx-4 space-y-5">
        <div className=" ml-8  border rounded-lg p-7">
          <Button
            onClick={() => router.push("/job-posting")}
            variant="outline"
            className="w-full font-semibold rounded-full border-2 border-blue-500 hover:border-blue-700"
          >
            <div className="flex items-center space-x-3 justify-center text-blue-500">
              <SquarePen />
              <p className="text-base">Post a free job</p>
            </div>
          </Button>
        </div>
        <div className="ml-8 border rounded-lg">
          <div className="flex flex-col">
            <div className="bg-[#F9FAFB]">
              <p className="font-medium text-2xl p-7">Posted Jobs</p>
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
                  <div className="flex ml-3 cursor-pointer justify-between w-full">
                    <div className="flex flex-col">
                      <p className="font-semibold hover:underline">
                        {job.title}
                      </p>
                      <p className="text-muted-foreground font-light text-sm">
                        {job.location} ({job.workplaceType})
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="rounded-full hover:bg-[#F4F2EE] p-3 "
                        >
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col items-center justify-start w-[200px] absolute -right-6">
                        <Button
                          onClick={() =>
                            router.push(`/job-posting/edit/${job.id}`)
                          }
                          variant="ghost"
                          className="w-full flex items-center justify-start space-x-2"
                        >
                          <Pencil />
                          <p>Edit post</p>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-start space-x-2"
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
