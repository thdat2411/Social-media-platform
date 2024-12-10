"use client";
import ApllicationIcon from "@/app/assets/application.png";
import CompanyImage from "@/app/assets/company.png";
import NoPostImage from "@/app/assets/my-items-no-post.svg";
import PencilIcon from "@/app/assets/pencil.png";
import TrashIcon from "@/app/assets/trash.png";
import { JobsPost } from "@/app/jobs/main-content";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Ellipsis, SquarePen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface PostedJobsMainContentProps {
  jobPosts: JobsPost[];
}

const PostedJobsMainContent = ({ jobPosts }: PostedJobsMainContentProps) => {
  console.log(jobPosts);
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
      <div className="ml-8 w-1/2 space-y-2 max-[1400px]:w-[65%] max-[1200px]:w-[55%] max-[900px]:w-[65%] max-[750px]:ml-0 max-[750px]:w-[80%]">
        <div className="rounded-lg border bg-white p-7">
          <Button
            onClick={() => router.push("/job-posting")}
            variant="outline"
            className="w-full rounded-full border-2 border-blue-500 font-semibold hover:border-blue-700"
          >
            <div className="flex items-center justify-center space-x-3 text-blue-500">
              <SquarePen />
              <p className="text-basec">Post a free job</p>
            </div>
          </Button>
        </div>
        <div className="rounded-lg border">
          <div className="flex flex-col bg-white">
            <div className="bg-[#F9FAFB]">
              <p className="p-7 text-2xl font-medium max-[1200px]:text-xl">
                Job Postings
              </p>
            </div>
            <Separator />
            {postedJobs.length > 0 ? (
              <>
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
                              <Image
                                src={PencilIcon}
                                alt=""
                                className="size-5"
                              />
                              <p>Edit post</p>
                            </Button>
                            <Button
                              onClick={() =>
                                router.push(`/manage-jobPosts?id=${job.id}`)
                              }
                              variant="ghost"
                              className="flex w-full items-center justify-start space-x-2"
                            >
                              <Image
                                src={ApllicationIcon}
                                alt=""
                                className="size-5"
                              />
                              <p>View Applicants</p>
                            </Button>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Separator />
                  </>
                ))}
                <div className="my-4 flex items-center justify-center space-x-7 bg-white">
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
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center space-y-4 p-10">
                <Image src={NoPostImage} alt="" />
                <p className="text-2xl font-medium">No job posts found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostedJobsMainContent;
