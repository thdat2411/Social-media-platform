"use client";
import { useCurrentPath } from "@/app/hooks/useCurrentPath";
import { category, jobHeader } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSearchingCategoriesList from "../hooks/useSearchingCategoriesList";
import { JobsPost } from "../jobs/main-content";
import SubHeaderDropdown from "../jobs/search/drop-down";

interface SubHeaderProps {
  jobs?: JobsPost[] | null;
  setJobs?: React.Dispatch<React.SetStateAction<JobsPost[] | null>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}

const SubHeader = ({ jobs, setJobs, setTotalPages }: SubHeaderProps) => {
  const [isCateogryOpen, setIsCategoryOpen] = useState(false);
  const router = useRouter();
  const categoryList = useSearchingCategoriesList();
  const pathName = useCurrentPath();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const isWhatCategory =
    pathName === "/search"
      ? "All"
      : pathName?.includes("jobs")
        ? "Jobs"
        : pathName?.includes("posts")
          ? "Posts"
          : "People";

  const onCategoryClick = (category: string) => {
    if (category === "Jobs") {
      router.push("/jobs/search/");
    } else if (category === "Posts") {
      router.push("/search/posts");
    } else if (category === "People") {
      router.push("/search/people");
    }
  };
  const renderSubHeaderDropdowns = () => {
    if (isWhatCategory === "Jobs") {
      const sortedJobHeaders = jobHeader.map((item) => ({
        ...item,
        isActive: activeFilters.includes(item.title),
      }));

      const activeHeaders = sortedJobHeaders.filter((item) => item.isActive);
      const inactiveHeaders = sortedJobHeaders.filter((item) => !item.isActive);

      const sortedHeaders = [...activeHeaders.reverse(), ...inactiveHeaders];

      return sortedHeaders.map((item) => (
        <SubHeaderDropdown
          key={item.title}
          title={item.title}
          jobs={jobs!}
          setJobs={setJobs}
          setTotalPages={setTotalPages}
          content={item.content}
          isCheckbox={item.title === "Date posted" ? false : true}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      ));
    } else if (isWhatCategory === "Posts") {
      return (
        <SubHeaderDropdown
          title="Date posted"
          content={["Any time", "Past 24 hours", "Past week", "Past month"]}
          isCheckbox={false}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      );
    } else {
      return (
        <SubHeaderDropdown
          title="Location"
          content={["Any time", "Past 24 hours", "Past week", "Past month"]}
          isCheckbox={false}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      );
    }
  };

  if (isWhatCategory !== "All") {
    return (
      <div className="sticky top-0 z-20 w-screen bg-white py-3 shadow-lg">
        <div className="flex w-[860px] justify-end space-x-2 max-[1260px]:w-full max-[1260px]:justify-center">
          <DropdownMenu open={isCateogryOpen} onOpenChange={setIsCategoryOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="flex w-fit items-center space-x-2 rounded-full bg-blue-500 px-3 py-2 text-white hover:bg-blue-700">
                <p>{isWhatCategory}</p>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-3 flex w-[150px] cursor-pointer flex-col rounded-sm border bg-white shadow-sm">
              {categoryList.map((item) => (
                <Link
                  href={item.pathname}
                  key={item.label}
                  className={`${
                    pathName && item.pathname.includes(pathName)
                      ? "border-l-2 border-l-blue-500"
                      : ""
                  } px-4 py-2 hover:bg-[#EDF3F8]`}
                >
                  {item.label}
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="border-l border-black" />
          {renderSubHeaderDropdowns()}
        </div>
      </div>
    );
  } else {
    return (
      <div className="sticky top-0 z-20 w-screen bg-white py-3 shadow-lg">
        <div className="flex w-[650px] justify-end space-x-6">
          {category.map(
            (item) =>
              item !== "All" && (
                <Button
                  onClick={() => onCategoryClick(item)}
                  key={item}
                  variant="outline"
                  className="rounded-full p-0 px-4 outline outline-1 hover:outline-2"
                >
                  {item}
                </Button>
              )
          )}
        </div>
      </div>
    );
  }
};

export default SubHeader;
