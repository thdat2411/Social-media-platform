"use client";
import GrayAvatar from "@/app/assets/gray-avatar.png";
import { JobsPost } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface JobListSideBarProps {
  data: JobsPost;
  isSelection: boolean;
  isLoading: boolean;
}

const JobListSideBar = ({
  data,
  isSelection,
  isLoading,
}: JobListSideBarProps) => {
  if (isLoading) {
    return (
      <div className="flex cursor-pointer items-start justify-between space-x-4 border-b p-4">
        <div className="flex space-x-5">
          <Image src={GrayAvatar} alt="Company logo" width={70} height={70} />
          <div>
            <div className="mb-2 h-4 w-[200px] rounded-full bg-gray-400" />
            <div className="mb-2 h-4 w-[150px] rounded-full bg-gray-400" />
            <div className="h-4 w-[100px] rounded-full bg-gray-400" />
          </div>
        </div>
        <div className="rounded-full bg-gray-400 p-3" />
      </div>
    );
  }
  return (
    <Link
      href={`/jobs/search/${data.id}`}
      className={`flex cursor-pointer items-start justify-between space-x-4 border-b p-4 ${
        isSelection ? "border-b-2 border-l-2 border-l-black bg-slate-200" : ""
      }`}
    >
      <div className="flex space-x-5">
        <Image
          src="https://github.com/shadcn.png"
          alt="Company logo"
          width={70}
          height={70}
        />
        <div>
          <p className="text-lg font-semibold text-blue-600 hover:underline">
            {data.title}
          </p>
          <p className="text-sm">{data.company}</p>
          <p className="text-sm text-gray-600">
            {data.location} · {data.workplaceType}{" "}
          </p>
        </div>
      </div>
      <Button className="rounded-full p-3" variant="ghost">
        <X className="size-4 p-0" />
      </Button>
    </Link>
  );
};

export default JobListSideBar;
