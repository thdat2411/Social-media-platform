import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import getCurrentUser from "../actions/getCurrentUser";
import JobPostingMainContent from "./main-content";

const JobPostingPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="my-7 flex w-full justify-center">
      <div className="min-[1500px]: flex justify-between max-[1670px]:w-[75%] max-[1250px]:w-[85%] min-[1670px]:w-[60%]">
        <JobPostingMainContent user={user!} />
        <div className="flex w-[25%] flex-col space-y-2 overflow-x-hidden">
          <div className="space-y-1 overflow-x-hidden rounded-lg border bg-white p-6">
            <HiOutlineLightBulb className="mb-6 size-6" color="green" />
            <p className="text-sm font-semibold text-gray-500">
              Target your job to the right people
            </p>
            <p className="text-justify text-sm text-muted-foreground">
              Include a job description and add required skills to target job
              seekers who match your criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPage;
