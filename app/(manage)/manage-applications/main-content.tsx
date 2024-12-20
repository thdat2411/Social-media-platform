"use client";
import NotFoundImage from "@/app/assets/404-error.png";
import FooterLink from "@/app/components/footerLink";
import { application } from "@/app/my-items/my-application/main-content";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ManageDetailApplication from "./detail-application";
import ManageApplicationSideBar from "./side-bar";
import { useSearchParams } from "next/navigation";
const ManageApplicationsMainContent = () => {
    const postId = useSearchParams().get("id");
  const [applications, setApplications] = useState<application[] | null>([]);
  const [applicationIndex, setApplicationIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/manage/applications?page=${currentPage}&id=${postId}`
        );
        const { applications, totalPages } = response.data;
        if (response.status === 200) {
          setApplications(applications);
          setTotalPages(totalPages);
          setApplicationIndex(0);
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
                  {applications?.length === 0 || !applications ? (
                    <div className="flex h-[58vh] flex-col items-center justify-center text-2xl font-semibold">
                      <Image
                        src={NotFoundImage}
                        alt="No post available"
                        className="size-40"
                      />
                      No post available
                    </div>
                  ) : (
                    applications.map((application, index) => (
                      <ManageApplicationSideBar
                        data={application}
                        key={index}
                        applications={applications}
                        isSelection={applicationIndex === index}
                        setApplicationIndex={setApplicationIndex}
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
            {!applications || applications.length === 0 ? (
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

                <ManageDetailApplication
                  application={applications[applicationIndex]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ManageApplicationsMainContent;
