"use client";
import { useJobId } from "@/app/hooks/useJobId";
import { JobsPost, JobsPostList } from "@/app/utils/utils";
import React, { useEffect, useState } from "react";
import JobContent from "./job-content";
import JobListSideBar from "./job-list-sidebar";

const JobSearchPage = () => {
  const jobId = useJobId();
  const jobs: JobsPost[] = JobsPostList;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  return (
    <div className="z-10 flex flex-1 overflow-hidden">
      <div className="flex w-full justify-center">
        <div className="flex-shrik flex w-4/6">
          <aside className="w-2/5 bg-white">
            {!isLoading ? (
              <div className="border border-t-0 p-4">
                <h2 className="text-xl font-bold">intern in Vietnam</h2>
                <p className="text-gray-600">{jobs.length} results</p>
              </div>
            ) : (
              <div className="border border-t-0 p-4">
                <div className="mb-2 h-4 w-[300px] rounded-full bg-gray-400" />
                <div className="h-4 w-[200px] rounded-full bg-gray-400" />
              </div>
            )}
            <div className="h-[77vh] overflow-y-auto border border-t-0">
              <div className="border-b">
                {jobs.map((job, index) => (
                  <JobListSideBar
                    key={index}
                    data={job}
                    isSelection={index === Number(jobId) - 1 ? true : false}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </div>
          </aside>
          <div className="flex h-[85vh] w-3/5 flex-col overflow-y-auto border border-l-0 border-t-0 bg-white p-10">
            <JobContent data={jobs[Number(jobId) - 1]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
