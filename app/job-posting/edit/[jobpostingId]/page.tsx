"use client";
import { JobsPostList } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import JobPostingDescription from "../../description-textarea";
import JobPostingDropdown from "../../drop-down";
import { FormDataType } from "../../main-content";
import PreviewModal from "../../preview-modal";

const JobPostingEditPage = () => {
  const postedJobId = useParams().jobpostingId as string;
  const postedJob = JobsPostList.find((job) => job.id === postedJobId);
  const [isWorkplaceOpen, setIsWorkplaceOpen] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [isJobLevelOpen, setIsJobLevelOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState("80px");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    jobTitle: postedJob!.title,
    company: postedJob!.company,
    workplaceType: postedJob!.workplaceType,
    jobLocation: postedJob!.location,
    jobType: postedJob!.jobType,
    level: postedJob!.level,
    description: postedJob!.description,
    skills: postedJob!.skill,
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
      <div className="mx-auto my-7 max-w-4xl rounded-lg border bg-white shadow-md">
        <h1 className="mb-4 p-6 text-2xl font-semibold">
          Post a job description
        </h1>
        <Separator />

        <div className="flex flex-col space-y-4 p-6">
          <p className="text-sm text-muted-foreground">* Indicates required</p>
          <p className="text-xl font-semibold">Job details*</p>
          <div className="flex w-full space-x-10 pb-10">
            <div className="flex w-1/2 flex-col space-y-2">
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
                className="rounded-md border border-black p-2 text-sm"
                required
              />
            </div>
            <div className="flex w-1/2 flex-col space-y-2">
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
                className="rounded-md border border-black p-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex w-full space-x-10 pb-7">
            <div className="flex w-1/2 flex-col space-y-2">
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
            <div className="flex w-1/2 flex-col space-y-2">
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
                className="rounded-md border border-black p-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex w-full space-x-10 pb-7">
            <div className="flex w-1/2 flex-col space-y-2">
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
            <div className="flex w-1/2 flex-col space-y-2">
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
            <p className="mb-4 text-xl font-semibold">Description*</p>
            <JobPostingDescription
              setFormData={setFormData}
              formData={formData}
            />
          </div>
          <p className="text-xl font-semibold">Skill*</p>
          <p className="text-sm text-muted-foreground">
            {" "}
            Add skill keywords (max 10) to make your job more visible to the
            right candidates.
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
                  className="mb-3 mr-2 flex w-fit justify-between space-x-2 rounded-full bg-blue-500 p-3 text-base text-white hover:bg-blue-700 hover:text-white"
                >
                  <p>{skill}</p>
                  <X className="size-5" />
                </Button>
              ))}
            <div className="flex h-fit w-fit items-center rounded-full border">
              <input
                type="text"
                ref={inputRef}
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="rounded-l-full border-black py-2 pl-2 text-sm"
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
                className="rounded-full p-0 pr-2 hover:bg-transparent"
                disabled={formData.skills.length >= 10}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between p-6">
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
            className="rounded-full bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default JobPostingEditPage;
