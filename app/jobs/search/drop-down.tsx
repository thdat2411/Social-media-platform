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
import React, { useState } from "react";
import { JobsPost } from "../main-content";

interface SubHeaderDropdownProps {
  title: string;
  jobs?: JobsPost[];
  setJobs?: React.Dispatch<React.SetStateAction<JobsPost[] | null>>;
  setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
  content: string[];
  isCheckbox: boolean;
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const SubHeaderDropdown = ({
  title,
  jobs,
  setJobs,
  setTotalPages,
  content,
  isCheckbox,
  activeFilters,
  setActiveFilters,
}: SubHeaderDropdownProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [levelSelectedItems, setLevelSelectedItems] = useState<string[]>([]);
  const [prevLevelSelectedItems, setPrevLevelSelectedItems] = useState<
    string[]
  >([]);
  const [remoteSelectedItems, setRemoteSelectedItems] = useState<string[]>([]);
  const [prevRemoteSelectedItems, setPrevRemoteSelectedItems] = useState<
    string[]
  >([]);
  const [datePostSelectedItems, setDatePostSelectedItems] =
    useState<string>("Any time");
  const [prevDatePostSelectedItems, setPrevDatePostSelectedItems] =
    useState<string>("Any time");

  const [jobsTemp, setJobsTemp] = useState<JobsPost[] | null>(jobs ?? null);

  const [originalJobs, setOriginalJobs] = useState<JobsPost[] | null>(
    jobs ?? null
  );

  const handleChange = (item: string) => {
    if (title === "Experience level") {
      setLevelSelectedItems((prev) => {
        const updatedItems = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];
        setJobsTemp(
          originalJobs!.filter((job) => {
            if (updatedItems.length === 0) {
              return true;
            } else {
              return job.level !== null && updatedItems.includes(job.level);
            }
          })
        );

        return updatedItems;
      });
    } else if (title === "Remote") {
      setRemoteSelectedItems((prev) => {
        const updatedItems = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev, item];
        setJobsTemp(
          originalJobs!.filter((job) => {
            if (updatedItems.length === 0) {
              return true;
            } else {
              return (
                job.workplace_type !== null &&
                updatedItems.includes(job.workplace_type)
              );
            }
          })
        );
        return updatedItems;
      });
    } else {
      const updatedItems = item;
      const now = new Date();
      const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      setJobsTemp(
        originalJobs!.filter((job) => {
          const jobDate = job?.created_at
            ? new Date(job.created_at)
            : new Date();
          return updatedItems === "Past 24 hours"
            ? jobDate > past24Hours
            : updatedItems === "Past week"
              ? jobDate > pastWeek
              : updatedItems === "Past month"
                ? jobDate > pastMonth
                : true;
        })
      );
      setDatePostSelectedItems(updatedItems);
    }
  };

  const handleCancel = () => {
    if (
      prevDatePostSelectedItems !== datePostSelectedItems ||
      prevLevelSelectedItems !== levelSelectedItems ||
      prevRemoteSelectedItems !== remoteSelectedItems
    ) {
      setLevelSelectedItems(prevLevelSelectedItems);
      setRemoteSelectedItems(prevRemoteSelectedItems);
      setDatePostSelectedItems(prevDatePostSelectedItems);
    }
  };

  const onSubmit = () => {
    if (
      levelSelectedItems.length > 0 ||
      remoteSelectedItems.length > 0 ||
      datePostSelectedItems !== "Any time"
    ) {
      setPrevLevelSelectedItems(levelSelectedItems);
      setPrevRemoteSelectedItems(remoteSelectedItems);
      setPrevDatePostSelectedItems(datePostSelectedItems);
      setActiveFilters((prev) => {
        return [...prev, title];
      });
    } else {
      setActiveFilters((prev) => {
        return prev.filter((item) => item !== title);
      });
    }
    setJobs!(jobsTemp);
    setOriginalJobs!(jobsTemp);
    setTotalPages!(Math.ceil(jobsTemp!.length / 15));
    setIsDropDownOpen(false);
  };

  const onClose = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      !activeFilters.includes(title) &&
      !event.relatedTarget?.classList.contains("show-button")
    ) {
      if (title === "Experience level") {
        setLevelSelectedItems([]);
      } else if (title === "Remote") {
        setRemoteSelectedItems([]);
      } else {
        setDatePostSelectedItems("Any time");
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
                      ? levelSelectedItems.includes(item)
                      : remoteSelectedItems.includes(item)
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
            Show
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubHeaderDropdown;
