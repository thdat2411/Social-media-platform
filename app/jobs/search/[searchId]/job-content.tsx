"use client";
import Renderer from "@/app/components/renderer";
import { formatDate, JobsPost } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";

interface JobContentProps {
  data: JobsPost;
}

const JobContent = ({ data }: JobContentProps) => {
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll ? data.skill : data.skill.slice(0, 2);
  const additionalCount = data.skill.length - 2;
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full justify-between pb-4">
          <div className="flex items-center space-x-3">
            <Image
              src="https://github.com/shadcn.png"
              alt="Company logo"
              width={45}
              height={45}
            />
            <p className="font-medium">{data.company}</p>
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
          href={`/jobs/search/${data.id}`}
          className="cursor-pointer pb-3 text-2xl font-semibold hover:underline"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {data.location} · {formatDate(data.date)} ·{" "}
          <span className="text-green-600">{data.applicants} applicants</span>
        </p>

        <div className="flex items-center space-x-2 py-2 text-sm">
          <MdBusinessCenter className="size-7 text-[#666666]" />
          <p>
            {data.jobType} · {data.level}{" "}
          </p>
        </div>
        <div className="flex items-center space-x-2 py-2 text-sm">
          <FaListCheck className="ml-[0.5px] mr-1 size-6 text-[#666666]" />
          <p>
            Skills:{" "}
            {skillsToShow.map((skill, index) => (
              <span key={index}>
                {skill}
                {index < skillsToShow.length - 1 && ", "}
              </span>
            ))}
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
      <div className="mt-8">
        <h2 className="text-xl font-bold">About the job</h2>
        <Renderer value={data.description} />
      </div>
    </>
  );
};

export default JobContent;
