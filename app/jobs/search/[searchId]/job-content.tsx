import { formatDate, JobsPost } from "@/app/utils/utils";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MdBusinessCenter } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { Pin, PinOff, SquareArrowOutUpRight } from "lucide-react";
import Renderer from "@/app/components/renderer";

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
        <div className="flex justify-between w-full pb-4">
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
        <h1 className="text-2xl font-semibold pb-3">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          {data.location} · {formatDate(data.date)}
        </p>

        <div className="flex space-x-2 items-center text-sm py-2">
          <MdBusinessCenter className="size-7 text-[#666666]" />
          <p>
            {data.jobType} · {data.level}{" "}
          </p>
        </div>
        <div className="flex space-x-2 items-center text-sm py-2">
          <FaListCheck className="size-6 text-[#666666] ml-[0.5px] mr-1" />
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
      <div className="flex items-center space-x-2 mt-2">
        <Button
          variant="ghost"
          className="bg-blue-600 text-white px-4 py-2 rounded-full space-x-1 hover:bg-blue-800 hover:text-white"
        >
          <p className="font-medium text-base py-3 px-2">Apply</p>
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
