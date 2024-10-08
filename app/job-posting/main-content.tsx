"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useRef, useState } from "react";
import JobPostingDropdown from "./drop-down";
import dynamic from "next/dynamic";
import { jobPostingDescription } from "../utils/utils";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import PreviewModal from "./preview-modal";

const JobPostingDescription = dynamic(() => import("./description-textarea"), {
  ssr: false,
});
export type FormDataType = {
  jobTitle: string;
  company: string;
  workplaceType: string;
  jobLocation: string;
  jobType: string;
  description: string;
  level: string;
  skills: string[];
};

const JobPostingMainContent = () => {
  const [isWorkplaceOpen, setIsWorkplaceOpen] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [isJobLevelOpen, setIsJobLevelOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState("80px");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    jobTitle: "",
    company: "",
    workplaceType: "On-site",
    jobLocation: "",
    jobType: "Full-time",
    level: "Entry level",
    description: jobPostingDescription,
    skills: [],
  });
  const workplaceType = ["On-site", "Remote", "Hybrid"];
  const jobType = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
  ];
  const jobLevel = [
    "Entry level",
    "Associate",
    "Mid-Senior level",
    "Director",
    "Executive",
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = "16px sans-serif";
      const textWidth = context.measureText(skill).width;
      setInputWidth(`${Math.max(80, textWidth + 20)}px`);
    }
  }, [skill]);
  return (
    <>
      <PreviewModal
        open={isReviewModalOpen}
        setOpen={setIsReviewModalOpen}
        formData={formData}
      />
      <h1 className="text-2xl font-semibold p-6 mb-4">
        Post a job description
      </h1>
      <Separator />
      <div className="flex flex-col p-6 space-y-4">
        <p className="text-muted-foreground text-sm">* Indicates required</p>
        <p className="font-semibold text-xl">Job details*</p>
        <div className="flex w-full space-x-10 pb-10">
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Job title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              id="job-title"
              className="border rounded-md p-2 text-sm border-black"
              required
            />
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Company
            </label>
            <input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              type="text"
              id="job-title"
              className="border rounded-md p-2 text-sm border-black"
              required
            />
          </div>
        </div>
        <div className="flex w-full space-x-10 pb-7">
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Workplace type
            </label>
            <JobPostingDropdown
              isWorkplaceOpen={isWorkplaceOpen}
              setIsWorkplaceOpen={setIsWorkplaceOpen}
              isJobTypeOpen={isJobTypeOpen}
              setIsJobTypeOpen={setIsJobTypeOpen}
              isJobLevelOpen={isJobLevelOpen}
              setIsJobLevelOpen={setIsJobLevelOpen}
              formData={formData}
              setFormData={setFormData}
              workplaceType={workplaceType}
              jobType={jobType}
              level={jobLevel}
              whatDropdown="workplace"
            />
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Job location
            </label>
            <input
              value={formData.jobLocation}
              onChange={(e) =>
                setFormData({ ...formData, jobLocation: e.target.value })
              }
              type="text"
              id="job-title"
              className="border rounded-md p-2 text-sm border-black"
              required
            />
          </div>
        </div>
        <div className="flex w-full space-x-10 pb-7">
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Job type
            </label>
            <JobPostingDropdown
              isWorkplaceOpen={isWorkplaceOpen}
              setIsWorkplaceOpen={setIsWorkplaceOpen}
              isJobTypeOpen={isJobTypeOpen}
              setIsJobTypeOpen={setIsJobTypeOpen}
              isJobLevelOpen={isJobLevelOpen}
              setIsJobLevelOpen={setIsJobLevelOpen}
              formData={formData}
              setFormData={setFormData}
              workplaceType={workplaceType}
              jobType={jobType}
              level={jobLevel}
              whatDropdown="jobType"
            />
          </div>
          <div className="flex flex-col w-1/2 space-y-2">
            <label
              htmlFor="job-title"
              className="text-sm text-muted-foreground"
            >
              Level
            </label>
            <JobPostingDropdown
              isWorkplaceOpen={isWorkplaceOpen}
              setIsWorkplaceOpen={setIsWorkplaceOpen}
              isJobTypeOpen={isJobTypeOpen}
              setIsJobTypeOpen={setIsJobTypeOpen}
              isJobLevelOpen={isJobLevelOpen}
              setIsJobLevelOpen={setIsJobLevelOpen}
              formData={formData}
              setFormData={setFormData}
              workplaceType={workplaceType}
              jobType={jobType}
              level={jobLevel}
              whatDropdown="jobLevel"
            />
          </div>
        </div>
        <div>
          <p className="font-semibold text-xl mb-4">Description*</p>
          <JobPostingDescription
            setFormData={setFormData}
            formData={formData}
          />
        </div>
        <p className="font-semibold text-xl">Skill*</p>
        <p className="text-muted-foreground text-sm">
          {" "}
          Add skill keywords (max 10) to make your job more visible to the right
          candidates.
        </p>
        <div className="flex flex-wrap">
          {formData.skills !== null &&
            formData.skills.map((skill, index) => (
              <Button
                onClick={() =>
                  setFormData({
                    ...formData,
                    skills: formData.skills.filter((_, i) => i !== index),
                  })
                }
                key={index}
                variant="ghost"
                className="bg-blue-500 p-3 space-x-2 text-white rounded-full hover:bg-blue-700 hover:text-white flex justify-between w-fit text-base mr-2 mb-3"
              >
                <p>{skill}</p>
                <X className="size-5" />
              </Button>
            ))}
          <div className="rounded-full border h-fit flex items-center w-fit">
            <input
              type="text"
              ref={inputRef}
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="rounded-l-full  pl-2 py-2 text-sm border-black"
              style={{ width: inputWidth }}
              placeholder="Add skill"
              disabled={formData.skills.length >= 10}
            />
            <Button
              onClick={() => {
                setFormData({
                  ...formData,
                  skills: [...formData.skills, skill],
                });
                setSkill("");
              }}
              variant="ghost"
              className="hover:bg-transparent p-0 pr-2 rounded-full "
              disabled={formData.skills.length >= 10}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between items-center p-6">
        <Button
          onClick={() => {
            setIsReviewModalOpen(true);
            console.log(formData.description);
          }}
          variant="ghost"
          className="text-blue-500 hover:bg-blue-100 hover:text-blue-700"
        >
          Preview
        </Button>
        <Button
          type="submit"
          onClick={() => console.log(formData)}
          className="bg-blue-500 text-white hover:bg-blue-700 rounded-full hover:text-white"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default JobPostingMainContent;
