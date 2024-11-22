"use client";
import FooterLink from "@/app/components/footerLink";
import { Separator } from "@/components/ui/separator";
import { job_application, job_posting, user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DetailApplication from "./detail-application";
import JobApplicationPage from "./job-application";
import ManageApplicationSideBar from "./side-bar";

export type ManageJobPost = job_posting & {
  user?: user;
  job_applications?: (job_application & { user: user })[];
};

const ManageApplicationsMainContent = () => {
  const [jobs, setJobs] = useState<ManageJobPost[] | null>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [detailApplication, setDetailApplication] = useState<
    (job_application & { user: user }) | null
  >(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/manage?page=${currentPage}`);
        const { jobPosts, totalPages } = response.data;
        if (response.status === 200) {
          setJobs(jobPosts);
          setTotalPages(totalPages);
          setPostIndex(0);
        } else {
          toast.error("Error fetching job data");
        }
      } catch {
        toast.error("Error fetching job data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage]);
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 8;

    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 4);

    // Adjust start and end pages if we have too many buttons
    if (endPage - startPage + 1 > maxButtons) {
      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxButtons + 1);
      } else {
        endPage = Math.min(totalPages, startPage + maxButtons - 1);
      }
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="mr-4 rounded-full px-4 py-2 text-sm"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="left-truncate">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mr-4 size-9 rounded-full ${i === currentPage ? "bg-black font-medium text-white" : "hover:bg-slate-100"} text-sm`}
        >
          {i}
        </button>
      );
    }

    // Add right truncation
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="right-truncate">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="mr-4 rounded-full px-4 py-2 text-sm"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

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
      <div
        className="z-10 flex flex-1 overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex w-full justify-center">
          <div className="flex-shrik flex w-4/6">
            <aside className="w-2/5 bg-white">
              <div className="w-full border-b border-r px-5 py-6">
                <p className="text-xl font-medium">Your posts</p>
              </div>
              <div className="h-[75vh] overflow-y-auto border border-t-0">
                <div className="border-b">
                  {jobs?.length === 0 || !jobs ? (
                    <div className="flex h-[86vh] flex-col items-center justify-center text-3xl font-semibold">
                      No post yet
                    </div>
                  ) : (
                    jobs.map((job, index) => (
                      <ManageApplicationSideBar
                        key={index}
                        data={job}
                        setData={setJobs}
                        jobs={jobs}
                        setIsDetail={setIsDetail}
                        isSelection={index === postIndex}
                        setPostIndex={setPostIndex}
                      />
                    ))
                  )}
                  {totalPages > 1 && (
                    <div className="flex justify-center p-4">
                      <div className="mx-4 flex items-center">
                        {renderPaginationButtons()}
                      </div>
                    </div>
                  )}
                  <FooterLink />
                </div>
              </div>
            </aside>
            {!jobs ? (
              <div></div>
            ) : (
              <div
                className="flex w-3/5 flex-col border border-l-0 border-t-0 bg-white"
                style={{
                  scrollbarColor: "#F4F2EE #FFF",
                }}
              >
                <p className="px-5 py-6 text-xl font-medium">Applications</p>
                <Separator />
                {!isDetail ? (
                  <JobApplicationPage
                    jobPostApplications={jobs[postIndex].job_applications!}
                    setDetailApplication={setDetailApplication}
                    setIsDetail={setIsDetail}
                  />
                ) : (
                  <DetailApplication
                    application={detailApplication}
                    setIsDetail={setIsDetail}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ManageApplicationsMainContent;
