"use client";
import { JobsPost } from "@/app/jobs/main-content";
import { user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
    <div className="my-7 flex w-full flex-col items-center justify-center">
      <EditJobPostingMainContent job_posting={jobPosting!} user={user!} />;
    </div>
  );
};

export default JobPostingEditPage;
