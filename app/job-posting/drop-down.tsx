"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { job_posting } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

interface JobPostingDropdownProps {
  isWorkplaceOpen: boolean;
  setIsWorkplaceOpen: (value: boolean) => void;
  isJobTypeOpen: boolean;
  setIsJobTypeOpen: (value: boolean) => void;
  isJobLevelOpen: boolean;
  setIsJobLevelOpen: (value: boolean) => void;
  formData: job_posting;
  setFormData: (value: job_posting) => void;
  workplaceType: string[];
  jobType: string[];
  level: string[];
  whatDropdown: "workplace" | "jobType" | "jobLevel";
}

const JobPostingDropdown = ({
  isWorkplaceOpen,
  setIsWorkplaceOpen,
  isJobTypeOpen,
  setIsJobTypeOpen,
  isJobLevelOpen,
  setIsJobLevelOpen,
  formData,
  setFormData,
  workplaceType,
  jobType,
  level,
  whatDropdown,
}: JobPostingDropdownProps) => {
  const [dimensions, setDimensions] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        console.log(dimensions);
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (whatDropdown === "workplace") {
    return (
      <DropdownMenu open={isWorkplaceOpen} onOpenChange={setIsWorkplaceOpen}>
        <DropdownMenuTrigger className="w-full">
          <div className="flex w-full flex-1 justify-between rounded-md border border-black p-2">
            <p className="w-full text-left max-[450px]:text-xs min-[450px]:text-sm">
              {formData.workplace_type}
            </p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-full flex-col space-y-2 py-2">
          {workplaceType.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({
                  ...formData,
                  workplace_type: type,
                });
                setIsWorkplaceOpen(false);
              }}
              className="justify-start max-[550px]:max-w-full min-[550px]:w-[350px]"
            >
              <div className="flex flex-col text-start">
                <div className="py-4">
                  <p className="pt-2">{type}</p>
                  <p className="break-words pb-2 text-xs text-muted-foreground">
                    {type === "On-site"
                      ? "Employees come to work in-person"
                      : type === "Hybrid"
                        ? "Employees work on-site or off-site"
                        : "Employees work off-site"}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (whatDropdown === "jobType") {
    return (
      <DropdownMenu open={isJobTypeOpen} onOpenChange={setIsJobTypeOpen}>
        <DropdownMenuTrigger>
          <div className="flex w-full justify-between rounded-md border border-black p-2">
            <p className="max-[450px]:text-xs min-[450px]:text-sm">
              {formData.job_type}
            </p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-full flex-col justify-start py-2">
          {jobType.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({ ...formData, job_type: type });
                setIsJobTypeOpen(false);
              }}
              className="justify-start max-[550px]:max-w-[250px] min-[550px]:w-[350px]"
            >
              {type}
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <DropdownMenu open={isJobLevelOpen} onOpenChange={setIsJobLevelOpen}>
        <DropdownMenuTrigger>
          <div className="flex w-full justify-between rounded-md border border-black p-2">
            <p className="max-[450px]:text-xs min-[450px]:text-sm">
              {formData.level}
            </p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-full flex-col justify-start py-2">
          {level.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({ ...formData, level: type });
                setIsJobLevelOpen(false);
              }}
              className="justify-start max-[550px]:max-w-[250px] min-[550px]:w-[350px]"
            >
              {type}
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

export default JobPostingDropdown;
