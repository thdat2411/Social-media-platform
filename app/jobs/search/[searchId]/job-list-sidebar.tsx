"use client";
import { JobsPost } from "@/app/utils/utils";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import GrayAvatar from "@/app/assets/gray-avatar.png";
import Link from "next/link";
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
      <div className="p-4 flex items-start space-x-4 border-b cursor-pointer justify-between">
        <div className="flex space-x-5">
          <Image src={GrayAvatar} alt="Company logo" width={70} height={70} />
          <div>
            <div className="w-[200px] h-4 bg-gray-400 rounded-full mb-2" />
            <div className="w-[150px] h-4 bg-gray-400 rounded-full mb-2" />
            <div className="w-[100px] h-4 bg-gray-400 rounded-full" />
          </div>
        </div>
        <div className="rounded-full p-3 bg-gray-400" />
      </div>
    );
  }
  return (
    <Link
      href={`/jobs/search/${data.id}`}
      className={`p-4 flex items-start space-x-4 border-b cursor-pointer justify-between ${
        isSelection ? "border-l-black border-l-2 bg-slate-200 border-b-2" : ""
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
          <p className="font-semibold text-blue-600 text-lg hover:underline">
            {data.title}
          </p>
          <p className="text-sm">{data.company}</p>
          <p className="text-gray-600 text-sm">
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
