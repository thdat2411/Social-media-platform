"use client";
import SubHeader from "@/app/components/sub-header";
import { useJobId } from "@/app/hooks/useJobId";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import JobContent, { JobPostsWithUsers } from "./job-content";
import JobListSideBar from "./job-list-sidebar";

const JobSearchPage = () => {
  const jobId = useJobId();
  const [jobs, setJobs] = useState<JobPostsWithUsers[] | null>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/jobs/search/${jobId}`);
        console.log(response.data);
        const { jobPosts } = response.data;
        if (response.status === 200) {
          console.log("fecth oke");
          setJobs(jobPosts);
          setIsLoading(false);
        } else {
          toast.error("Error fetching job data");
          return;
        }
      } catch {
        toast.error("Error fetching job data");
      }
    };
    fetchJobs();
  }, [jobId]);
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">
        <div className="flex flex-col items-center">
          <Loader className="size-10 animate-spin" />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <SubHeader jobs={jobs} setJobs={setJobs} />
        <div className="z-10 flex flex-1 overflow-hidden">
          <div className="flex w-full justify-center">
            <div className="flex-shrik flex w-4/6">
              <aside className="w-2/5 bg-white">
                <div
                  className="h-[85vh] overflow-y-auto border border-t-0"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div className="border-b">
                    {!jobs ? (
                      <div className="flex h-[85vh] flex-col items-center justify-center text-3xl font-semibold">
                        No post yet
                      </div>
                    ) : (
                      jobs!.map((job, index) => (
                        <JobListSideBar
                          key={index}
                          data={job}
                          jobs={jobs!}
                          isSelection={index === postIndex ? true : false}
                          isLoading={isLoading}
                          setPostIndex={setPostIndex}
                        />
                      ))
                    )}
                  </div>
                </div>
              </aside>
              {!jobs ? (
                <div></div>
              ) : (
                <div className="flex h-[85vh] w-3/5 flex-col overflow-y-auto border border-l-0 border-t-0 bg-white p-10">
                  <JobContent data={jobs![postIndex]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default JobSearchPage;
