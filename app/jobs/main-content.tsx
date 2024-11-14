"use client";
import { Button } from "@/components/ui/button";
import { job_posting } from "@prisma/client";
import { ChevronLeft, ChevronRight, Clock, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import JobsContainer from "./container";

export type History = {
  title: string;
  location: string;
};

export type JobsPost = job_posting & { applicantCount: number };

interface JobsMainContentProps {
  jobPosts: JobsPost[];
}

const JobsMainContent = ({ jobPosts }: JobsMainContentProps) => {
  const router = useRouter();
  const jobs = jobPosts.slice(0, 3);
  const scrollRef = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const history: History[] = [
    {
      title: "Software Engineer",
      location: "Ho Chi Minh City, Vietnam",
    },
    {
      title: "Product Manager",
      location: "Ho Chi Minh City, Vietnam",
    },
    {
      title: "Data Analyst",
      location: "Ho Chi Minh City, Vietnam",
    },
  ];

  const scroll = (direction: "left" | "right"): void => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300; // Adjust the scroll amount as needed
      (scrollRef.current as HTMLElement).scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setIsLeftDisabled(scrollLeft === 0);
      setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current as unknown as HTMLElement;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mx-4 w-1/2 max-[900px]:w-[80%]">
      <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm">
        <div className="flex flex-col space-y-2">
          <p className="px-4 pt-4 text-xl font-semibold">Job picks for you</p>
          <p className="px-4 text-sm text-[#919191]">
            Based on your profile and search history
          </p>
          <div className="flex w-full flex-col space-y-3 p-4">
            {jobs.map((item) => (
              <JobsContainer key={item.id} item={item} lists={jobs} />
            ))}
          </div>
          <Button
            onClick={() => {
              router.push("/jobs/search");
            }}
            variant="ghost"
            className="h-14 w-full rounded-l-none rounded-r-none rounded-tl-none rounded-tr-none p-0 pr-3"
          >
            <p>Show all</p>
            <MoveRight />
          </Button>
        </div>
      </div>
      <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <p className="p-4 pt-4 text-xl font-semibold">Job picks for you</p>
            <div className="flex items-center space-x-3 p-4">
              <Button
                variant="ghost"
                className={`rounded-full border-2 border-black bg-white p-2 ${
                  isLeftDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => scroll("left")}
                disabled={isLeftDisabled}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border-2 border-black bg-white p-2"
                onClick={() => scroll("right")}
                disabled={isRightDisabled}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div
            className="flex w-full overflow-x-hidden px-4 pb-4"
            ref={scrollRef}
          >
            <div className="flex space-x-2 py-4">
              {history.map((item, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  className="flex-shrink-0 space-x-2 rounded-lg border border-[#DADEE2] p-6"
                >
                  <Clock className="size-6" />
                  <p className="max-[ text-sm font-medium">
                    {item.title} ∙ {item.location}
                  </p>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsMainContent;
