"use client";
import FooterLink from "@/app/components/footerLink";
import SubHeader from "@/app/components/sub-header";
import { user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobsPost } from "../main-content";
import JobContent from "./job-content";
import JobListSideBar from "./job-list-sidebar";

const JobSearchPage = () => {
  const params = useSearchParams();
  const searchKeyword = params.get("keyword");
  const [jobs, setJobs] = useState<JobsPost[] | null>([]);
  const [postIndex, setPostIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState<JobsPost[] | null>([]);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/search?keyword=${searchKeyword}&page=${currentPage}`
        );
        const { jobPostings, totalPages, jobPostingsTotal, user } =
          response.data;
        if (response.status === 200) {
          setJobs(jobPostings);
          setTotalPages(totalPages);
          setTotalJobs(jobPostingsTotal);
          setUser(user);
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
  }, [searchKeyword, currentPage]);

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
      <>
        <SubHeader
          jobs={totalJobs}
          setJobs={setJobs}
          setTotalPages={setTotalPages}
        />
        <div
          className="z-10 flex flex-1 overflow-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex w-full justify-center">
            <div className="flex-shrik flex w-4/6">
              <aside className="w-2/5 bg-white">
                <div className="w-full border-b border-r px-5 py-6">
                  <p className="text-xl font-medium">Top job picks for you</p>
                  <p>Based on your ....</p>
                </div>
                <div className="h-[75vh] overflow-y-auto border border-t-0">
                  <div className="border-b">
                    {!jobs ? (
                      <div className="flex h-[75vh] flex-col items-center justify-center text-3xl font-semibold">
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
                  className="flex h-[86vh] w-3/5 flex-col overflow-y-auto border border-l-0 border-t-0 bg-white p-10"
                  style={{
                    scrollbarColor: "#F4F2EE #FFF",
                  }}
                >
                  <JobContent data={jobs![postIndex]} user={user!} />
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
