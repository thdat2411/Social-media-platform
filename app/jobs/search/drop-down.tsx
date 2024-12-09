"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { JobsPost } from "../main-content";

interface SubHeaderDropdownProps {
  title: string;
  jobs?: JobsPost[];
  tempJobs?: JobsPost[] | null;
  setTempJobs?: React.Dispatch<React.SetStateAction<JobsPost[] | null>>;
  setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
  levelSelectedItems?: string[];
  setLevelSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>;
  remoteSelectedItems?: string[];
  setRemoteSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>;
  datePostSelectedItems?: string;
  setDatePostSelectedItems?: React.Dispatch<React.SetStateAction<string>>;
  content: string[];
  isCheckbox: boolean;
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const SubHeaderDropdown = ({
  title,
  jobs,
  tempJobs,
  setTempJobs,
  setTotalPages,
  levelSelectedItems,
  setLevelSelectedItems,
  remoteSelectedItems,
  setRemoteSelectedItems,
  datePostSelectedItems,
  setDatePostSelectedItems,
  content,
  isCheckbox,
  activeFilters,
  setActiveFilters,
}: SubHeaderDropdownProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [prevLevelSelectedItems, setPrevLevelSelectedItems] = useState<
    string[]
  >([]);
  const [prevRemoteSelectedItems, setPrevRemoteSelectedItems] = useState<
    string[]
  >([]);
  const [prevDatePostSelectedItems, setPrevDatePostSelectedItems] =
    useState<string>("Any time");

  const [jobsTemp, setJobsTemp] = useState<JobsPost[] | null>(null);

  const [resultNumber, setResultNumber] = useState<number>(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setJobsTemp(tempJobs!);
    setResultNumber(jobs?.length!);
    setIsFirstRender(false);
    console.log("Rendered");
  }, []);

  useEffect(() => {
    if (!isFirstRender && jobsTemp) {
      setResultNumber(jobsTemp.length);
    }
  }, [jobsTemp]);

  const handleChange = (item: string) => {
    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Helper function to apply all active filters
    const applyFilters = (
      updatedDatePostSelectedItems: string = datePostSelectedItems ||
        "Any time",
      updatedLevelSelectedItems: string[] = levelSelectedItems || [],
      updatedRemoteSelectedItems: string[] = remoteSelectedItems || []
    ) => {
      let filteredJobs = jobs || [];

      // Apply experience level filter
      if (updatedLevelSelectedItems.length > 0) {
        filteredJobs = filteredJobs.filter(
          (job) =>
            (job.level !== null || job.job_type !== null) &&
            (updatedLevelSelectedItems.includes(job.level ?? "") ||
              updatedLevelSelectedItems.includes(job.job_type ?? ""))
        );
      }

      // Apply remote filter
      if (updatedRemoteSelectedItems.length > 0) {
        filteredJobs = filteredJobs.filter(
          (job) =>
            job.workplace_type !== null &&
            updatedRemoteSelectedItems.includes(job.workplace_type)
        );
      }

      // Apply date post filter
      if (updatedDatePostSelectedItems) {
        filteredJobs = filteredJobs.filter((job) => {
          const jobDate = job?.created_at
            ? new Date(job.created_at)
            : new Date();
          return updatedDatePostSelectedItems === "Past 24 hours"
            ? jobDate > past24Hours
            : updatedDatePostSelectedItems === "Past week"
              ? jobDate > pastWeek
              : updatedDatePostSelectedItems === "Past month"
                ? jobDate > pastMonth
                : true;
        });
      }

      setJobsTemp(filteredJobs);
    };

    if (title === "Experience level") {
      setLevelSelectedItems!((prev) => {
        const updatedItems = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];
        applyFilters(datePostSelectedItems, updatedItems, remoteSelectedItems);
        return updatedItems;
      });
    } else if (title === "Remote") {
      setRemoteSelectedItems!((prev) => {
        const updatedItems = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];
        applyFilters(datePostSelectedItems, levelSelectedItems, updatedItems);
        return updatedItems;
      });
    } else {
      const updatedItems = item;
      setDatePostSelectedItems!(updatedItems);
      applyFilters(updatedItems, levelSelectedItems, remoteSelectedItems);
    }
  };

  const handleCancel = () => {
    if (
      prevDatePostSelectedItems !== datePostSelectedItems ||
      prevLevelSelectedItems !== levelSelectedItems ||
      prevRemoteSelectedItems !== remoteSelectedItems
    ) {
      setLevelSelectedItems!(prevLevelSelectedItems);
      setRemoteSelectedItems!(prevRemoteSelectedItems);
      setDatePostSelectedItems!(prevDatePostSelectedItems);
    }
  };

  const onSubmit = () => {
    if (
      (levelSelectedItems!.length > 0 &&
        !activeFilters.includes("Experience level")) ||
      (remoteSelectedItems!.length > 0 && !activeFilters.includes("Remote")) ||
      (datePostSelectedItems !== "Any time" &&
        !activeFilters.includes("Date posted"))
    ) {
      setPrevLevelSelectedItems(levelSelectedItems!);
      setPrevRemoteSelectedItems(remoteSelectedItems!);
      setPrevDatePostSelectedItems(datePostSelectedItems!);
      setActiveFilters((prev) => {
        return [...prev, title];
      });
    } else {
      setActiveFilters((prev) => {
        return prev.filter((item) => item !== title);
      });
    }
    setTempJobs!(jobsTemp);
    setTotalPages!(Math.ceil(jobsTemp!.length / 15));
    setIsDropDownOpen(false);
  };

  const onClose = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      !activeFilters.includes(title) &&
      !event.relatedTarget?.classList.contains("show-button")
    ) {
      if (title === "Experience level") {
        setLevelSelectedItems!([]);
      } else if (title === "Remote") {
        setRemoteSelectedItems!([]);
      } else {
        setDatePostSelectedItems!("Any time");
      }
    }
    setIsDropDownOpen(false);
  };

  return (
    <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
      <DropdownMenuTrigger
        className={`flex items-center space-x-2 rounded-full p-2 ${
          activeFilters.includes(title)
            ? "bg-blue-500 text-white hover:bg-blue-700"
            : "border-2 hover:border-[#858585] hover:bg-slate-100"
        }`}
      >
        <p className="text-sm font-medium">{title}</p>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent onBlur={onClose}>
        <div className="w-72 p-3">
          {content.map((item, index) => (
            <div
              onClick={() => handleChange(item)}
              key={index}
              className="mb-2 flex w-fit cursor-pointer items-center justify-start space-x-4 px-2 py-3"
            >
              {isCheckbox && (
                <Checkbox
                  className="size-5"
                  checked={
                    title === "Experience level"
                      ? levelSelectedItems!.includes(item)
                      : remoteSelectedItems!.includes(item)
                  }
                />
              )}
              {!isCheckbox && (
                <input
                  className="size-5"
                  type="radio"
                  readOnly
                  checked={datePostSelectedItems === item}
                />
              )}
              <p>{item}</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-end space-x-4 p-3">
          {activeFilters.includes(title) && (
            <Button
              onClick={() => {
                handleCancel();
                setIsDropDownOpen(false);
              }}
              className="rounded-lg"
              variant="ghost"
            >
              Cancel
            </Button>
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            className="show-button rounded-full bg-blue-600 text-white hover:bg-blue-800"
          >
            {/* Show {resultNumber ? `(${resultNumber})` : null} */}
            Show ({resultNumber})
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubHeaderDropdown;
