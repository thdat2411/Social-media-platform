"use client";
import useSearchingCategoriesList from "@/app/hooks/useSearchingCategoriesList";
import { jobs } from "@/app/utils/jobs";
import { Button } from "@/components/ui/button";
import JobContainer from "@/app/components/job-container";
import React from "react";
import { useRouter } from "next/navigation";

export type Lists = {
  label: string;
  hiringName: string;
  location: string;
  createdAt: string;
};

const SearchMainContent = () => {
  const jobList: Lists[] = jobs;
  const lists = useSearchingCategoriesList();
  const router = useRouter();
  return (
    <div className="w-1/2 mx-4">
      {lists.map((item) => (
        <>
          <div className="bg-white rounded-lg shadow-sm mb-4 border-[1.5px] border-[#DADEE2]">
            <div
              id={item.label.toLowerCase()}
              className="flex flex-col  space-y-2"
            >
              <p className="font-semibold text-xl p-4 ">{item.label}</p>
              <div className="flex flex-col w-full space-y-3">
                {jobList.map((item, index) => (
                  <JobContainer
                    key={index}
                    index={index}
                    item={item}
                    label={item.label}
                    lists={jobList}
                  />
                ))}
                <Button
                  onClick={() => {
                    router.push(item.pathname);
                  }}
                  variant="ghost"
                  className="border h-14 rounded-tr-none rounded-tl-none rounded-r-none rounded-l-none  w-full pr-3"
                >
                  <p>See all {item.label}</p>
                </Button>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default SearchMainContent;
