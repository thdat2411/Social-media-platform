"use client";
import { category, jobHeader } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useCurrentPath } from "@/app/hooks/useCurrentPath";
import { useRouter } from "next/navigation";
import SubHeaderDropdown from "../jobs/search/[searchId]/drop-down";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import useSearchingCategoriesList from "../hooks/useSearchingCategoriesList";
import Link from "next/link";

const SubHeader = () => {
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
      router.push("/jobs/search/1");
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
      <div className="w-screen py-3 shadow-lg z-20 sticky top-0 ">
        <div className="flex w-[860px] max-[1260px]:justify-center max-[1260px]:w-full  space-x-2 justify-end">
          <DropdownMenu open={isCateogryOpen} onOpenChange={setIsCategoryOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full w-fit flex py-2 px-3 items-center bg-blue-500 text-white hover:bg-blue-700 space-x-2">
                <p>{isWhatCategory}</p>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white w-[150px]  flex flex-col cursor-pointer mt-3 shadow-sm rounded-sm border">
              {categoryList.map((item) => (
                <Link
                  href={item.pathname}
                  key={item.label}
                  className={`${
                    pathName && item.pathname.includes(pathName)
                      ? "border-l-2 border-l-blue-500"
                      : ""
                  } hover:bg-[#EDF3F8] py-2 px-4`}
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
      <div className="w-screen py-3 shadow-lg z-20 sticky top-0 ">
        <div className="flex space-x-6 w-[650px] justify-end">
          {category.map(
            (item) =>
              item !== "All" && (
                <Button
                  onClick={() => onCategoryClick(item)}
                  key={item}
                  variant="outline"
                  className="rounded-full border-2 hover:border-black"
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
