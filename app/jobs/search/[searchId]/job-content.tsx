"use client";
import CompanyImage from "@/app/assets/company.png";
import Renderer from "@/app/components/renderer";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import { Pin, PinOff, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { JobsPost } from "../../main-content";

export type JobPostsWithUsers = JobsPost & { author: user };

interface JobContentProps {
  data: JobPostsWithUsers;
}

const JobContent = ({ data }: JobContentProps) => {
  console.log(data);
  const avatarFallBack = data!.company_name.split(" ").pop()?.charAt(0);
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll
    ? data!.required_skills
    : data!.required_skills.slice(0, 2);
  const additionalCount = data!.required_skills.length - 2;
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full justify-between pb-4">
          <div className="flex items-center space-x-3">
            <Image
              src={CompanyImage}
              alt="Company logo"
              width={45}
              height={45}
            />
            <p className="font-medium">{data!.company_name}</p>
          </div>
          {true ? (
            <Button variant="ghost" className="rounded-full p-3">
              <Pin />
            </Button>
          ) : (
            <Button variant="ghost" className="rounded-full p-3">
              <PinOff />
            </Button>
          )}
        </div>
        <Link
          href={`/jobs/search/${data!.id}`}
          className="cursor-pointer pb-3 text-2xl font-semibold hover:underline"
        >
          {data!.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {data!.location} ·{" "}
          {data!.created_at ? formatDate(data!.created_at) : "Unknown date"} ·{" "}
          <span className="text-green-600">
            {data!.applicantCount} applicants
          </span>
        </p>

        <div className="flex items-center space-x-2 py-2 text-sm">
          <MdBusinessCenter className="size-7 text-[#666666]" />
          <p>
            {data!.job_type} · {data!.level}{" "}
          </p>
        </div>
        <div className="flex items-center space-x-2 py-2 text-sm">
          <FaListCheck className="ml-[0.5px] mr-1 size-6 text-[#666666]" />
          <p>
            Skills:{" "}
            {data!.required_skills?.length === 0 ? (
              <span className="text-muted-foreground">(None)</span>
            ) : (
              skillsToShow?.map((skill, index) => (
                <span key={index}>
                  {skill}
                  {index < skillsToShow.length - 1 && ", "}
                </span>
              ))
            )}
            {additionalCount > 0 && !showAll && (
              <button
                onClick={handleToggle}
                className="text-blue-600 hover:underline"
              >
                , +{additionalCount} more
              </button>
            )}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <Button
          variant="ghost"
          className="space-x-1 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-800 hover:text-white"
        >
          <p className="px-2 py-3 text-base font-medium">Apply</p>
          <SquareArrowOutUpRight className="size-5" />
        </Button>
      </div>
      <div className="mt-4 flex flex-col rounded-xl border px-4 py-2">
        <p className="my-2 text-base font-semibold">Posted by</p>
        <div className="mb-2 flex items-center space-x-4">
          <Avatar className="size-14">
            <AvatarImage
              src={data!.author.image ?? ""}
              className="rounded-full"
            />
            <AvatarFallback className="bg-blue-300 text-2xl text-white">
              {avatarFallBack}
            </AvatarFallback>
          </Avatar>
          <div className="mb-3 flex flex-col">
            <p className="font-medium">{data!.author.name}</p>
            <p className="text-sm">
              Student at HCMC University of Technology and Education
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">About the job</h2>
        <Renderer value={data!.description} />
      </div>
    </>
  );
};

export default JobContent;
