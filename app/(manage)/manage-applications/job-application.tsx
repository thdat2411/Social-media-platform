"use client";
import DetailIcon from "@/app/assets/details.png";
import NoApplicationImage from "@/app/assets/no-application.png";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { job_application, user } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";

interface JobApplicationPageProps {
  jobPostApplications: (job_application & { user: user })[];
  setDetailApplication: React.Dispatch<
    React.SetStateAction<(job_application & { user: user }) | null>
  >;
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const JobApplicationPage = ({
  jobPostApplications,
  setDetailApplication,
  setIsDetail,
}: JobApplicationPageProps) => {
  if (!jobPostApplications || jobPostApplications.length === 0) {
    return (
      <div className="flex h-full flex-shrink flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <Image
            src={NoApplicationImage}
            alt="No application"
            className="size-72"
          />
          <p className="text-2xl font-medium">No application</p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-[75vh] overflow-y-auto">
      {jobPostApplications.map((jobPostApplication, index) => (
        <>
          <div
            key={jobPostApplication.id}
            className="flex w-full cursor-pointer items-center space-x-4 p-8 hover:bg-gray-100"
            onClick={() => {
              setDetailApplication(jobPostApplication);
              setIsDetail(true);
            }}
          >
            <p className="text-xl font-medium text-muted-foreground">From: </p>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="size-16">
                  <AvatarImage
                    src={jobPostApplication.user?.image ?? ""}
                    className="rounded-full"
                  />
                  <AvatarFallback className="size-16 bg-blue-300 text-2xl font-medium text-white">
                    {jobPostApplication.user.name.split(" ").pop()?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <p className="text-lg font-medium">
                    {jobPostApplication.user.name}
                  </p>
                  {jobPostApplication.user?.bio && (
                    <p>{jobPostApplication.user.bio}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    applied{" "}
                    {jobPostApplication.created_at
                      ? formatDate(jobPostApplication.created_at)
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center space-x-2">
                <Image src={DetailIcon} alt="" className="size-5" />
                <p className="font-medium text-gray-600 hover:text-black hover:underline">
                  See detail
                </p>
              </div>
            </div>
          </div>
          {index !== jobPostApplications.length - 1 && <Separator />}
        </>
      ))}
    </div>
  );
};

export default JobApplicationPage;
