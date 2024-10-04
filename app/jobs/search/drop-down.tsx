"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import React from "react";

interface JobSearchDropdownProps {
  title: string;
  content: string[];
  isCheckbox: boolean;
}

const JobSearchDropdown = ({
  title,
  content,
  isCheckbox,
}: JobSearchDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 rounded-full p-2 border-2 hover:border-[#858585] hover:bg-slate-100">
        <p className="text-sm font-medium">{title}</p>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-3">
        {content.map((item, index) => (
          <div
            onClick={() => {}}
            key={index}
            className="flex w-fit justify-start items-center mb-2 px-2 py-3 space-x-3 cursor-pointer"
          >
            {isCheckbox && <Checkbox className="size-5" onClick={() => {}} />}
            {!isCheckbox && <input className="size-5" type="radio" />}
            <p>{item}</p>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobSearchDropdown;
