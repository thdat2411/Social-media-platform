"use client";
import ConfirmModal from "@/app/components/confirm-modal";
import { JobsPost } from "@/app/jobs/main-content";
import { capitalizeFirstLetter, skillList } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { job_posting, user } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { debounce } from "lodash";
import { Loader, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import JobPostingDropdown from "../../drop-down";
import InputSugesstion from "../../input-suggestion";
import PreviewModal from "../../preview-modal";

const JobPostingDescription = dynamic(
  () => import("../../description-textarea"),
  {
    ssr: false,
  }
);

interface JobPostingDropdownProps {
  job_posting: JobsPost;
  user: user;
}

const EditJobPostingMainContent = ({
  job_posting,
  user,
}: JobPostingDropdownProps) => {
  const router = useRouter();
  const [isWorkplaceOpen, setIsWorkplaceOpen] = useState(false);
  const [isJobTypeOpen, setIsJobTypeOpen] = useState(false);
  const [isJobLevelOpen, setIsJobLevelOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const inputRef = useRef(null);
  const [inputWidth, setInputWidth] = useState("80px");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isJobFocused, setIsJobFocused] = useState(false);
  const [isSkillFocused, setIsSkillFocused] = useState(false);
  const [skillSuggestion, setSkillSuggestion] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobError, setIsJobError] = useState(false);
  const [isCompanyError, setIsCompanyError] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [isDescriptionError, setIsDescriptionError] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [formData, setFormData] = useState<job_posting>(job_posting);

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
    "Senior",
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
  const debouncedFilterSuggestions = debounce((value) => {
    if (!value) {
      setSkill("");
      return;
    }
    const filteredTitles = skillList
      .filter((title) => title.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 200);
    setSkillSuggestion(filteredTitles);
  }, 300);
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkill(value);
    debouncedFilterSuggestions(value);
  };

  const handleUpdate = () => {
    setIsConfirmModalOpen(false);
    if (
      formData.title === "" ||
      formData.company_name === "" ||
      formData.location === "" ||
      formData.description === ""
    ) {
      if (formData.title === "") {
        setIsJobError(true);
      }
      if (formData.company_name === "") {
        setIsCompanyError(true);
      }
      if (formData.location === "") {
        setIsLocationError(true);
      }
      if (formData.description === "") {
        setIsDescriptionError(true);
      }
      toast.error("Please fill in all required fields");
    } else {
      setIsLoading(true);
      axios
        .put(`/api/job-posting/${job_posting.id}`, formData)
        .then(() => {
          toast.success("Update post successfully");
          router.refresh();
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.error ||
              "Posting job failed, please try again"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleUpdate}
        title="Update posting"
        content="Are you sure you want to update this job posting?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        width="400"
      />
      <ConfirmModal
        open={isDeleteConfirmModalOpen}
        setOpen={setIsDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={() => {}}
        title="Delete posting"
        content="Are you sure you want to delete this job posting?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        width="400"
      />
      <PreviewModal
        open={isReviewModalOpen}
        setOpen={setIsReviewModalOpen}
        formData={formData}
        user={user}
      />
      <div className="mx-10 overflow-x-hidden rounded-lg border bg-white shadow-md max-[500px]:w-11/12 min-[500px]:max-w-4xl">
        {isLoading && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="flex flex-col items-center">
              <Loader className="size-10 animate-spin" />
            </div>
          </div>
        )}
        <h1 className="bg-[#F9FAFB] p-6 font-semibold max-[450px]:text-xl min-[450px]:text-2xl">
          Post a job description
        </h1>
        <Separator />
        <div className="flex flex-col space-y-4 p-6">
          <p className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm">
            * Indicates required
          </p>
          <p className="font-semibold max-[450px]:text-lg min-[450px]:text-xl">
            Job details*
          </p>
          <div className="flex max-w-full flex-shrink-0 space-x-10 pb-7">
            <InputSugesstion
              formData={formData}
              setFormData={setFormData}
              isFocused={isJobFocused}
              setIsFocused={setIsJobFocused}
              label="Job title"
              isError={isJobError}
            />
            <div className="flex w-1/2 flex-col space-y-2">
              <label
                htmlFor="job-title"
                className={`${isCompanyError ? "text-red-500" : "text-muted-foreground"} max-[450px]:text-xs min-[450px]:text-sm`}
              >
                Company*
              </label>
              <input
                type="text"
                className={`rounded-md p-2 max-[450px]:text-xs min-[450px]:text-sm ${isCompanyError ? "outline outline-2 outline-red-500" : "border border-black"}`}
                value={formData?.company_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company_name: capitalizeFirstLetter(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex w-full space-x-10 pb-7">
            <div className="flex w-1/2 flex-col space-y-2">
              <label
                htmlFor="job-title"
                className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm"
              >
                Workplace type*
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
            <InputSugesstion
              formData={formData}
              setFormData={setFormData}
              isFocused={isLocationFocused}
              setIsFocused={setIsLocationFocused}
              label="Location"
              isError={isLocationError}
            />
          </div>
          <div className="flex w-full space-x-10 pb-7">
            <div className="flex w-1/2 flex-col space-y-2">
              <label
                htmlFor="job-title"
                className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm"
              >
                Job type*
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
                className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm"
              >
                Level*
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
            <p className="mb-4 font-semibold max-[450px]:text-lg min-[450px]:text-xl">
              Description*
            </p>
            <JobPostingDescription
              setFormData={setFormData}
              formData={formData}
              isError={isDescriptionError}
            />
          </div>
          <p className="font-semibold max-[450px]:text-lg min-[450px]:text-xl">
            Skills
          </p>
          <p className="text-muted-foreground max-[450px]:text-sm min-[450px]:text-xs">
            {" "}
            Add skill keywords (max 10) to make your job more visible to the
            right candidates.
          </p>
          <div className="flex flex-wrap">
            {formData?.required_skills !== null &&
              formData?.required_skills?.map((skill, index) => (
                <Button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      required_skills: formData?.required_skills.filter(
                        (_, i) => i !== index
                      ),
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
            <div className="relative flex h-fit w-fit items-center space-x-1 rounded-full border">
              <input
                type="text"
                ref={inputRef}
                value={skill}
                onChange={handleSkillChange}
                className="rounded-l-full border-black py-2 pl-2 text-sm"
                style={{ width: inputWidth }}
                placeholder="Add skill"
                disabled={formData?.required_skills?.length >= 10}
                onClick={() => setIsSkillFocused(true)}
                onBlur={() => setTimeout(() => setIsSkillFocused(false), 100)}
              />
              {isSkillFocused && skillSuggestion.length > 0 && (
                <ul
                  className="absolute top-12 z-10 max-h-24 w-[150px] overflow-y-auto rounded-lg border border-gray-300 bg-white"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {skillSuggestion.map((title) => (
                    <li
                      key={title}
                      className="cursor-pointer p-3 text-sm hover:bg-gray-200"
                      onClick={() => {
                        setSkill(capitalizeFirstLetter(title));
                        setIsSkillFocused(false);
                      }}
                    >
                      {capitalizeFirstLetter(title)}
                    </li>
                  ))}
                </ul>
              )}
              <Button
                onClick={() => {
                  setFormData({
                    ...formData,
                    required_skills: [...formData?.required_skills, skill],
                  });
                  setSkill("");
                  setSkillSuggestion([]);
                }}
                variant="ghost"
                className="rounded-full p-0 pr-2 hover:bg-transparent"
                disabled={formData?.required_skills?.length >= 10}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-wrap items-center justify-between p-6">
          <Button
            onClick={() => {
              setIsReviewModalOpen(true);
              console.log(formData.description);
            }}
            variant="ghost"
            className="text-base text-blue-500 hover:bg-blue-100 hover:text-blue-700"
          >
            Preview
          </Button>
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              onClick={() => setIsConfirmModalOpen(true)}
              className="rounded-full bg-red-500 text-lg text-white hover:bg-red-700 hover:text-white"
            >
              Delete
            </Button>
            <Button
              type="submit"
              onClick={() => setIsConfirmModalOpen(true)}
              className="rounded-full bg-blue-500 text-lg text-white hover:bg-blue-700 hover:text-white"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJobPostingMainContent;
