"use client";
import Renderer from "@/app/components/renderer";
import { formatDate, JobsPostList } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaLinkedin, FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";

const JobViewPage = () => {
  const jobPostId = useParams().postjobId as string;
  const jobPost = JobsPostList.find((post) => post.id === jobPostId);
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll ? jobPost?.skill : jobPost?.skill.slice(0, 2);
  const additionalCount = jobPost!.skill.length - 2;
  const router = useRouter();
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <div className="relative">
      <div className="flex w-full mt-4 mx-auto justify-center space-x-6">
        <div className="w-1/2 flex flex-col space-y-6 items-center pt-4 pb-6 justify-center">
          <div className=" w-full border shadow-md rounded-lg">
            <div className="flex justify-between">
              <div className="flex flex-col p-6 space-y-2">
                <div className="flex space-x-3 items-center">
                  <Image
                    src="https://github.com/shadcn.png"
                    alt=""
                    width={50}
                    height={50}
                  />
                  <p className="font-semibold">{jobPost?.company}</p>
                </div>
                <p className="text-2xl font-semibold">{jobPost!.title}</p>
                <p className="text-sm text-muted-foreground">
                  {jobPost!.location} ∙ {formatDate(jobPost!.date)} ∙{" "}
                  <span className="text-green-600">
                    {jobPost!.applicants} applicants
                  </span>
                </p>
                <div className="flex space-x-3 text-sm items-center pb-2">
                  <MdBusinessCenter className="size-6 text-[#666666]" />
                  <p>
                    {jobPost!.jobType} · {jobPost!.level}{" "}
                  </p>
                </div>
                <div className="flex space-x-3 text-sm items-center pb-4">
                  <FaListCheck className="size-5 text-[#666666] mr-1" />
                  <p className="break-words">
                    Skills:{" "}
                    {jobPost!.skill.length === 0 && (
                      <span className="text-muted-foreground">(None)</span>
                    )}
                    {skillsToShow!.map((skill, index) => (
                      <span key={index}>
                        {skill}
                        {index < skillsToShow!.length - 1 && ", "}
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
                <Button className="rounded-full bg-blue-500 w-fit space-x-3 hover:bg-blue-700 ">
                  <FaLinkedin className="size-5" />
                  <p className="text-base">Apply</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full border shadow-md rounded-lg">
            <div className="flex flex-col p-6 space-y-4">
              <p className="text-xl font-semibold">Meet the hiring team</p>
              <div className="flex justify-between">
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      className="size-16 cursor-pointer"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold self-start hover:underline cursor-pointer">
                      Thai Dat
                    </p>
                    <p className="text-sm">
                      Student at HCMC University of Technology and Education
                    </p>
                    <p className="self-start text-sm text-muted-foreground">
                      Job poster
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full h-fit space-x-3 border hover:border-2 border-black"
                >
                  <Send className="size-5" />
                  <p className="text-base">Message</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full border shadow-md rounded-lg ">
            <div className="flex flex-col p-6">
              <p className="text-xl font-semibold">About the job</p>
              <Renderer value={jobPost!.description} />
            </div>
          </div>
        </div>
        <div className="w-1/5 h-fit border shadow-md rounded-lg p-6 mt-4">
          <div className="flex items-center justify-center space-x-4">
            <p>Looking for talent?</p>
            <Button
              onClick={() => router.push("/job-posting")}
              variant="outline"
              className="rounded-full border border-blue-500 hover:border-blue-700 text-blue-500 px-7 py-3 hover:border-2 hover:text-blue-500"
            >
              Post a job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobViewPage;
