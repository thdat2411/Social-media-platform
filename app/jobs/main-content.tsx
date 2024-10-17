"use client";
import React, { useEffect, useRef, useState } from "react";
import JobsContainer from "./container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobsPostList } from "../utils/utils";

export type Jobs = {
  title: string;
  hiringName: string;
  location: string;
  isViewed: boolean;
  applicantNumber: number;
};

export type History = {
  title: string;
  location: string;
};

const JobsMainContent = () => {
  const router = useRouter();
  const jobs = JobsPostList.slice(0, 3);
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
    <div className="w-1/2 mx-4 max-[700px]:w-full max-[700px]:mx-0">
      <div className="bg-white rounded-lg shadow-sm mb-4 border-[1.5px] border-[#DADEE2]">
        <div className="flex flex-col  space-y-2">
          <p className="font-semibold text-xl pt-4  px-4 ">Job picks for you</p>
          <p className="text-sm text-[#919191] px-4">
            Based on your profile and search history
          </p>
          <div className="flex flex-col w-full space-y-3 p-4">
            {jobs.map((item, index) => (
              <JobsContainer key={index} item={item} lists={jobs} />
            ))}
          </div>
          <Button
            onClick={() => {
              router.push("/jobs/search");
            }}
            variant="ghost"
            className="h-14 p-0 rounded-tr-none rounded-tl-none rounded-r-none rounded-l-none  w-full pr-3"
          >
            <p>Show all</p>
            <MoveRight />
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm mb-4 border-[1.5px] border-[#DADEE2]">
        <div className="flex flex-col  space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-xl pt-4 p-4 ">Job picks for you</p>
            <div className="flex items-center space-x-3 p-4">
              <Button
                variant="ghost"
                className={`bg-white rounded-full p-2 border-2 border-black ${
                  isLeftDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => scroll("left")}
                disabled={isLeftDisabled}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                className="bg-white rounded-full p-2 border-2 border-black"
                onClick={() => scroll("right")}
                disabled={isRightDisabled}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div
            className="flex w-full pb-4 px-4 overflow-x-hidden"
            ref={scrollRef}
          >
            <div className="flex space-x-2 py-4">
              {history.map((item, index) => (
                <Button
                  variant="ghost"
                  key={index}
                  className="flex-shrink-0 space-x-2 rounded-lg p-6 border-[#DADEE2] border"
                >
                  <Clock className="size-6" />
                  <p className="text-sm font-medium">
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
