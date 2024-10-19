"use client";
import Renderer from "@/app/components/renderer";
import { formatDate, JobsPostList } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
      <div className="mx-auto mt-4 flex w-full justify-center space-x-6">
        <div className="flex w-1/2 flex-col items-center justify-center space-y-6 pb-6 pt-4">
          <div className="w-full rounded-lg border shadow-md">
            <div className="flex justify-between">
              <div className="flex flex-col space-y-2 p-6">
                <div className="flex items-center space-x-3">
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
                <div className="flex items-center space-x-3 pb-2 text-sm">
                  <MdBusinessCenter className="size-6 text-[#666666]" />
                  <p>
                    {jobPost!.jobType} · {jobPost!.level}{" "}
                  </p>
                </div>
                <div className="flex items-center space-x-3 pb-4 text-sm">
                  <FaListCheck className="mr-1 size-5 text-[#666666]" />
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
                <Button className="w-fit space-x-3 rounded-full bg-blue-500 hover:bg-blue-700">
                  <FaLinkedin className="size-5" />
                  <p className="text-base">Apply</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg border shadow-md">
            <div className="flex flex-col space-y-4 p-6">
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
                    <p className="cursor-pointer self-start font-semibold hover:underline">
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
                  className="h-fit space-x-3 rounded-full border border-black hover:border-2"
                >
                  <Send className="size-5" />
                  <p className="text-base">Message</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg border shadow-md">
            <div className="flex flex-col p-6">
              <p className="text-xl font-semibold">About the job</p>
              <Renderer value={jobPost!.description} />
            </div>
          </div>
        </div>
        <div className="mt-4 h-fit w-1/5 rounded-lg border p-6 shadow-md">
          <div className="flex items-center justify-center space-x-4">
            <p>Looking for talent?</p>
            <Button
              onClick={() => router.push("/job-posting")}
              variant="outline"
              className="rounded-full border border-blue-500 px-7 py-3 text-blue-500 hover:border-2 hover:border-blue-700 hover:text-blue-500"
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
