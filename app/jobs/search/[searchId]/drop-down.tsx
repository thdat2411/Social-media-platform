"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface SubHeaderDropdownProps {
  title: string;
  content: string[];
  isCheckbox: boolean;
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const SubHeaderDropdown = ({
  title,
  content,
  isCheckbox,
  activeFilters,
  setActiveFilters,
}: SubHeaderDropdownProps) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [levelSelectedItems, setLevelSelectedItems] = useState<string[]>([]);
  const [remoteSelectedItems, setRemoteSelectedItems] = useState<string[]>([]);
  const [datePostSelectedItems, setDatePostSelectedItems] =
    useState<string>("Any time");

  const handleChange = (item: string) => {
    if (title === "Experience level") {
      setLevelSelectedItems((prev) => {
        if (prev.includes(item)) {
          return prev.filter((i) => i !== item);
        }
        return [...prev, item];
      });
    } else if (title === "Remote") {
      setRemoteSelectedItems((prev) => {
        if (prev.includes(item)) {
          return prev.filter((i) => i !== item);
        }
        return [...prev, item];
      });
    } else {
      setDatePostSelectedItems(item);
    }
  };

  const onSubmit = () => {
    console.log(levelSelectedItems, remoteSelectedItems, datePostSelectedItems);
    if (
      levelSelectedItems.length > 0 ||
      remoteSelectedItems.length > 0 ||
      datePostSelectedItems !== "Any time"
    ) {
      setActiveFilters((prev) => {
        return [...prev, title];
      });
    } else {
      setActiveFilters((prev) => {
        return prev.filter((item) => item !== title);
      });
    }
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
            : "hover:border-[#858585] hover:bg-slate-100 border-2"
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
              className="flex w-fit justify-start items-center mb-2 px-2 py-3 space-x-4 cursor-pointer"
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
        <div className="flex justify-end items-center space-x-4 p-3">
          <Button
            onClick={() => setIsDropDownOpen(false)}
            className="rounded-lg"
            variant="ghost"
          >
            Cancel
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            className="rounded-full bg-blue-600 text-white hover:bg-blue-800 show-button"
          >
            Show
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubHeaderDropdown;
