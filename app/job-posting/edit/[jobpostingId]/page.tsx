"use client";
import { JobsPost } from "@/app/jobs/main-content";
import { user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import EditJobPostingMainContent from "./main-content";

const JobPostingEditPage = () => {
  const postedJobId = useParams().jobpostingId as string;
  const [jobPosting, setJobPosting] = useState<JobsPost | null>(null);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/jobs/view/${postedJobId}`);
      const { jobPost, currentUser } = response.data;
      setJobPosting(jobPost);
      setUser(currentUser);
    };

    fetchData();
  }, [postedJobId]);

  if (!jobPosting || !user) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="flex flex-col items-center">
          <Loader className="size-10 animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div className="my-7 flex w-full justify-center">
      <div className="min-[1500px]: flex justify-between max-[1670px]:w-[75%] max-[1250px]:w-[85%] min-[1670px]:w-[60%]">
        <EditJobPostingMainContent job_posting={jobPosting!} user={user!} />;
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

export default JobPostingEditPage;
