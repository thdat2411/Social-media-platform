"use client";
import { header } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import JobSearchDropdown from "./drop-down";

const SubHeader = () => {
  return (
    <div className="w-screen py-3 shadow-lg z-20 sticky top-0 ">
      <div className="flex w-[860px] space-x-2 justify-end">
        <Button className="rounded-full bg-blue-500 text-white hover:bg-blue-700 space-x-2">
          <p>Jobs</p>
          <ChevronDown className="size-4" />
        </Button>
        <p className="border-l border-black" />
        {header.map((item) => (
          <JobSearchDropdown
            key={item.title}
            title={item.title}
            content={item.content}
            isCheckbox={item.title === "Experience level" ? false : true}
          />
        ))}
      </div>
    </div>
  );
};

export default SubHeader;
