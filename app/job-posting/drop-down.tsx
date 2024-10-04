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
  formData: FormDataType;
  setFormData: (value: FormDataType) => void;
  workplaceType: string[];
  jobType: string[];
  isWorkPlace: boolean;
}

const JobPostingDropdown = ({
  isWorkplaceOpen,
  setIsWorkplaceOpen,
  isJobTypeOpen,
  setIsJobTypeOpen,
  formData,
  setFormData,
  workplaceType,
  jobType,
  isWorkPlace,
}: JobPostingDropdownProps) => {
  if (isWorkPlace) {
    return (
      <DropdownMenu open={isWorkplaceOpen} onOpenChange={setIsWorkplaceOpen}>
        <DropdownMenuTrigger>
          <div className="flex w-full border rounded-md justify-between p-2 border-black">
            <p className="text-sm">{formData.workplaceType}</p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full flex flex-col space-y-4 py-4">
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
              <div className="flex flex-col text-start flex-grow">
                <div className="py-4">
                  <p className="pt-2">{type}</p>
                  <p className="text-muted-foreground pb-2 text-xs">
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
  } else {
    return (
      <DropdownMenu open={isJobTypeOpen} onOpenChange={setIsJobTypeOpen}>
        <DropdownMenuTrigger>
          <div className="flex w-full border rounded-md justify-between p-2 border-black">
            <p className="text-sm">{formData.jobType}</p>
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full flex flex-col py-4 justify-start">
          {jobType.map((type) => (
            <Button
              key={type}
              variant="ghost"
              onClick={() => {
                setFormData({ ...formData, jobType: type });
                setIsWorkplaceOpen(false);
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
  }
};

export default JobPostingDropdown;
