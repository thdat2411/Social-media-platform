"use client";
import JobContainer from "@/app/components/job-container";
import useSearchingCategoriesList from "@/app/hooks/useSearchingCategoriesList";
import { Button } from "@/components/ui/button";
import { job_posting, post, user } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface SearchMainContentProps {
  jobPosts: job_posting[];
  people: user[];
  posts: post[];
}

const SearchMainContent = ({
  jobPosts,
  people,
  posts,
}: SearchMainContentProps) => {
  const lists = useSearchingCategoriesList();
  const router = useRouter();
  return (
    <div className="mx-4 w-[40%]">
      {lists.map((item) => (
        <>
          {item.label !== "All" && (
            <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm">
              <div
                id={item.label.toLowerCase()}
                className="flex flex-col space-y-2"
              >
                <p className="p-4 text-xl font-semibold">{item.label}</p>
                <div className="flex w-full flex-col space-y-3">
                  {jobPosts.slice(0, 3).map((item, index) => (
                    <JobContainer
                      key={index}
                      index={index}
                      item={item}
                      label="job"
                      lists={jobPosts.slice(0, 3)}
                    />
                  ))}
                  <Button
                    onClick={() => {
                      router.push(item.pathname);
                    }}
                    variant="ghost"
                    className="h-14 w-full rounded-l-none rounded-r-none rounded-tl-none rounded-tr-none border pr-3"
                  >
                    <p>See all {item.label}</p>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default SearchMainContent;
