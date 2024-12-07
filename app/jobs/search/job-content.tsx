"use client";
import ApplyIcon from "@/app/assets/apply.png";
import CompanyImage from "@/app/assets/company.png";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import { Pin, PinOff } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { JobsPost } from "../main-content";
import ApplicantModal from "../view/[jobpostId]/applicant-modal";

const Renderer = dynamic(() => import("@/app/components/renderer"), {
  ssr: false,
});

interface JobContentProps {
  data: JobsPost;
  user: user;
}

const JobContent = ({ data, user }: JobContentProps) => {
  console.log(data);
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll
    ? data?.required_skills
    : data?.required_skills.slice(0, 2);
  const additionalCount = data?.required_skills.length - 2;
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  return (
    <>
      <ApplicantModal
        open={isApplicantModalOpen}
        setOpen={setIsApplicantModalOpen}
        user={user!}
        jobPostId={data?.id}
      />
      <div className="flex flex-col items-start">
        <div className="flex w-full justify-between pb-4">
          <div className="flex items-center space-x-3">
            <Image
              src={CompanyImage}
              alt="Company logo"
              width={45}
              height={45}
              className="size-11 object-cover"
            />
            <p className="font-medium">{data?.company_name}</p>
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
          href={`/jobs/view/${data?.id}`}
          className="cursor-pointer pb-3 text-2xl font-semibold hover:underline"
        >
          {data?.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {data?.location} ·{" "}
          {data?.created_at ? formatDate(data?.created_at) : "Unknown date"} ·{" "}
          <span className="text-green-600">
            {data?._count?.job_applications} applicants
          </span>
        </p>

        <div className="flex items-center space-x-2 py-2 text-sm">
          <MdBusinessCenter className="size-7 text-[#666666]" />
          <p>
            {data?.job_type} · {data?.level}{" "}
          </p>
        </div>
        <div className="flex items-center space-x-2 py-2 text-sm">
          <FaListCheck className="ml-[0.5px] mr-1 size-6 text-[#666666]" />
          <p>
            Skills:{" "}
            {data?.required_skills?.length === 0 ? (
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
        {user.role !== "recruiter" && (
          <Button
            onClick={() => setIsApplicantModalOpen(true)}
            variant="ghost"
            className="space-x-1 rounded-full outline outline-1 hover:outline-2"
          >
            <Image src={ApplyIcon} alt="" className="size-8" />
            <p>Apply</p>
          </Button>
        )}
      </div>
      <div className="mt-4 flex flex-col rounded-xl border px-4 py-2">
        <p className="my-2 text-base font-semibold">Posted by</p>
        <div className="mb-2 flex items-center space-x-4">
          <Avatar className="size-14">
            <AvatarImage
              src={data.user?.image ?? ""}
              className="rounded-full"
            />
            <AvatarFallback className="bg-blue-300 text-2xl text-white">
              {data.user?.name.split(" ").pop()?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="mb-3 flex flex-col">
            <p className="font-medium">{data.user?.name}</p>
            <p className="text-sm">{data.user?.headline}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold">About the job</h2>
        <Renderer value={data?.description} />
      </div>
    </>
  );
};

export default JobContent;
