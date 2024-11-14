"use client";
import companyImage from "@/app/assets/company.png";
import FooterLink from "@/app/components/footerLink";
import Renderer from "@/app/components/renderer";
import ApplicantModal from "@/app/jobs/view/[jobpostId]/applicant-modal";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import { Pencil, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaLinkedin, FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { JobsPost } from "../../main-content";

interface JobViewMainContentProps {
  jobPost: JobsPost;
  user: user;
  employer: user;
}

const JobViewMainContent = ({
  jobPost,
  user,
  employer,
}: JobViewMainContentProps) => {
  const avatarFallBack = user.name.split(" ").pop()?.charAt(0).toUpperCase();
  const [showAll, setShowAll] = useState(false);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const skillsToShow = showAll
    ? jobPost?.required_skills
    : jobPost?.required_skills.slice(0, 2);
  const additionalCount = (jobPost?.required_skills?.length ?? 0) - 2;
  const router = useRouter();
  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <>
      <ApplicantModal
        open={isApplicantModalOpen}
        setOpen={setIsApplicantModalOpen}
        user={user}
        jobPostId={jobPost.id}
      />
      <div className="relative">
        <div className="mx-auto mt-4 w-full justify-center max-[800px]:flex max-[800px]:flex-col-reverse min-[800px]:flex min-[800px]:space-x-6">
          <div className="flex flex-col items-center justify-center space-y-6 pb-6 pt-4 max-[800px]:mx-auto max-[800px]:w-9/12 min-[800px]:w-5/12">
            <div className="w-full rounded-lg border bg-white shadow-md">
              <div className="flex justify-between">
                <div className="flex flex-col space-y-2 p-6">
                  <div className="flex items-center space-x-3">
                    <Image src={companyImage} alt="" width={60} height={60} />
                    <p className="font-semibold">{jobPost?.company_name}</p>
                  </div>
                  <p className="text-2xl font-semibold">{jobPost?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {jobPost?.location} ∙{" "}
                    {jobPost?.created_at
                      ? formatDate(jobPost?.created_at)
                      : "Unknown date"}{" "}
                    ∙{" "}
                    <span className="text-green-600">
                      {jobPost?.applicantCount} applicants
                    </span>
                  </p>
                  <div className="flex items-center space-x-3 pb-2 text-sm">
                    <MdBusinessCenter className="size-6 text-[#666666]" />
                    <p>
                      {jobPost?.job_type} · {jobPost?.level}{" "}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 pb-4 text-sm">
                    <FaListCheck className="mr-1 size-5 text-[#666666]" />
                    <p className="break-words">
                      Skills:{" "}
                      {jobPost?.required_skills.length === 0 && (
                        <span className="text-muted-foreground">(None)</span>
                      )}
                      {skillsToShow?.map((skill, index) => (
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
                  {employer?.id !== user.id ? (
                    <Button
                      onClick={() => setIsApplicantModalOpen(true)}
                      className="w-fit space-x-3 rounded-full bg-blue-500 hover:bg-blue-700"
                    >
                      <FaLinkedin className="size-5" />
                      <p className="text-base">Apply</p>
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        router.push(`/job-posting/edit/${jobPost.id}`)
                      }
                      className="w-fit space-x-3 rounded-full bg-blue-500 hover:bg-blue-700"
                    >
                      <Pencil className="size-5" />
                      <p className="text-base">Edit</p>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg border bg-white shadow-md">
              <div className="flex flex-col space-y-4 p-6">
                <p className="text-xl font-semibold">Meet the hiring team</p>
                <div className="flex justify-between">
                  <div className="flex space-x-3">
                    <Avatar className="size-14">
                      <AvatarImage
                        src={employer?.image ?? ""}
                        className="rounded-full"
                      />
                      <AvatarFallback className="bg-blue-300 text-lg text-white">
                        {avatarFallBack}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="cursor-pointer self-start font-semibold hover:underline">
                        {employer?.name}
                      </p>
                      <p className="text-sm">
                        {employer?.bio ?? "No bio available"}
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
            <div className="w-full rounded-lg border bg-white shadow-md">
              <div className="flex flex-col p-6">
                <p className="text-xl font-semibold">About the job</p>
                <Renderer value={jobPost?.description ?? ""} />
              </div>
            </div>
          </div>
          <div className="flex w-1/5 flex-col items-center space-y-5">
            <div className="mt-4 h-fit rounded-lg border bg-white p-6 shadow-md max-[800px]:mx-auto max-[800px]:w-9/12 min-[800px]:w-full min-[800px]:flex-col min-[800px]:justify-center">
              <div className="flex flex-wrap items-center justify-center max-[1500px]:space-y-4 max-[800px]:space-x-4 max-[800px]:space-y-0 min-[1500px]:space-x-4">
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
            <div className="flex h-[150px] w-[300px] flex-col">
              <FooterLink />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobViewMainContent;
