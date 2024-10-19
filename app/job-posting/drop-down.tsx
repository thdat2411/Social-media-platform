import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import React from "react";
import { FormDataType } from "./main-content";

interface JobPostingDropdownProps {
  isWorkplaceOpen: boolean;
  setIsWorkplaceOpen: (value: boolean) => void;
  isJobTypeOpen: boolean;
  setIsJobTypeOpen: (value: boolean) => void;
  isJobLevelOpen: boolean;
  setIsJobLevelOpen: (value: boolean) => void;
  formData: FormDataType;
  setFormData: (value: FormDataType) => void;
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
  if (whatDropdown === "workplace") {
    return (
      <DropdownMenu open={isWorkplaceOpen} onOpenChange={setIsWorkplaceOpen}>
        <DropdownMenuTrigger>
          <div className="flex w-full justify-between rounded-md border border-black p-2">
            <p className="text-sm">{formData.workplaceType}</p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-full flex-col space-y-2 py-2">
          {workplaceType.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({ ...formData, workplaceType: type });
                setIsWorkplaceOpen(false);
              }}
              className="w-[390px]"
            >
              <div className="flex flex-grow flex-col text-start">
                <div className="py-4">
                  <p className="pt-2">{type}</p>
                  <p className="pb-2 text-xs text-muted-foreground">
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
            <p className="text-sm">{formData.jobType}</p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-full flex-col justify-start py-2">
          {jobType.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({ ...formData, jobType: type });
                setIsJobTypeOpen(false);
              }}
              className="w-[390px] justify-start"
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
            <p className="text-sm">{formData.level}</p>
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
              className="w-[390px] justify-start"
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
