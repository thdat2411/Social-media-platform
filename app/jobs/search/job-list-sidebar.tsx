"use client";
import CompanyImage from "@/app/assets/company.png";
import GrayAvatar from "@/app/assets/gray-avatar.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { JobsPost } from "../main-content";

interface JobListSideBarProps {
  data: JobsPost;
  jobs: JobsPost[];
  isSelection: boolean;
  isLoading: boolean;
  setPostIndex: (index: number) => void;
}

const JobListSideBar = ({
  data,
  jobs,
  isSelection,
  isLoading,
  setPostIndex,
}: JobListSideBarProps) => {
  if (isLoading) {
    return (
      <div className="flex cursor-pointer items-start justify-between space-x-4 border-b p-4">
        <div className="flex space-x-5">
          <Image
            src={GrayAvatar}
            alt="Company logo"
            width={70}
            height={70}
            className="h-fit w-16 object-cover"
          />
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
    <div
      onClick={() => {
        console.log(jobs.indexOf(data));
        setPostIndex(jobs.indexOf(data));
      }}
      className={`flex cursor-pointer items-start justify-between space-x-4 border-b px-4 py-8 ${
        isSelection ? "border-b-2 border-l-2 border-l-black bg-slate-200" : ""
      }`}
    >
      <div className="flex space-x-5">
        <Image
          src={CompanyImage}
          alt="Company logo"
          width={60}
          height={60}
          className="size-14 object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-blue-600 hover:underline">
            {data.title}
          </p>
          <p className="text-sm">{data.company_name}</p>
          <p className="text-sm text-gray-600">
            {data.location} · {data.workplace_type}{" "}
          </p>
        </div>
      </div>
      <Button className="rounded-full p-3" variant="ghost">
        <X className="size-4 p-0" />
      </Button>
    </div>
  );
};

export default JobListSideBar;
