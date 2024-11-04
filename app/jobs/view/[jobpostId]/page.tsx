"use client";
import SSEComponent from "@/app/components/NotificationComponent";
import { user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { JobsPost } from "../../main-content";
import JobViewMainContent from "./main-content";

const JobViewPage = () => {
  const jobPostId = useParams().jobpostId as string;
  const [jobPost, setJobPost] = useState<JobsPost | null>(null);
  const [employer, setEmployer] = useState<user | null>(null);
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/jobs/view/${jobPostId}`);
        const data = response.data;
        setJobPost(data.jobPost);
        setEmployer(data.employer);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };
    fetchData();
  }, [jobPostId]);

  if (employer === null || jobPost === null) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">
        <div className="flex flex-col items-center">
          <Loader className="size-10 animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <>
  
      <JobViewMainContent
        jobPost={jobPost!}
        employer={employer!}
        user={currentUser!}
      />
    </>
  );
};

export default JobViewPage;
