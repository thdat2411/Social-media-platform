"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { job_posting, user } from "@prisma/client";
import axios from "axios";
import { debounce, set } from "lodash";
import { Loader, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiSparkleFill } from "react-icons/pi";
import { toast } from "sonner";
import {
  capitalizeFirstLetter,
  jobPostingDescription,
  skillList,
} from "../utils/utils";
import JobPostingDropdown from "./drop-down";
import InputSugesstion from "./input-suggestion";
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

interface JobPostingMainContentProps {
  user: user | null;
}

const JobPostingMainContent = ({ user }: JobPostingMainContentProps) => {
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
  const [triggerTypingAnimation, setTriggerTypingAnimation] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const workplaceType = useMemo(() => ["On-site", "Remote", "Hybrid"], []);
  const jobType = useMemo(
    () => ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
    []
  );
  const jobLevel = useMemo(
    () => [
      "Entry level",
      "Associate",
      "Mid-Senior level",
      "Director",
      "Executive",
      "Senior",
    ],
    []
  );
  const [formData, setFormData] = useState<job_posting>({
    id: "",
    location: "",
    company_name: "",
    created_at: null,
    updated_at: null,
    employer_id: user?.id ?? null,
    title: "",
    description: jobPostingDescription,
    workplace_type: "On-site",
    job_type: "Full-time",
    level: "Entry level",
    required_skills: [],
    status: "",
  });
  /*-------------------------------------------------------------*/
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  /*-------------------------------------------------------------*/

  useEffect(() => {
    // Run only on client-side after the component mounts
    if (typeof window !== undefined && skill.length > 0) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        context.font = "16px sans-serif"; // Match input font size and family
        const textWidth = context.measureText(skill).width;
        setInputWidth(`${Math.max(80, textWidth + 20)}px`); // Ensure a minimum width
      }
    }
  }, [skill]);
  /*-------------------------------------------------------------*/
  const generateDescription = async () => {
    if (!formData.title || !formData.company_name || !formData.location) {
      return;
    }
    try {
      setIsAILoading(true);
      await axios
        .post("/api/suggestion", {
          title: formData.title,
          company_name: formData.company_name,
          location: formData.location,
          workplaceType: formData.workplace_type,
          jobType: formData.job_type,
          level: formData.level,
        })
        .then((response) => {
          const { description } = response.data;
          setFormData((prevFormData) => ({
            ...prevFormData,
            description: description,
          }));
          setTriggerTypingAnimation(true);
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.error ||
              "Posting job failed, please try again"
          );
        })
        .finally(() => setIsAILoading(false));
    } catch {
      toast.error("Failed to generate job description");
    }
  };
  /*-------------------------------------------------------------*/
  const debouncedFilterSuggestions = debounce((value) => {
    if (!value) {
      setSkill("");
      return;
    }
    const filteredTitles = skillList
      .filter((title) => title.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 20);
    setSkillSuggestion(filteredTitles);
  }, 300);
  /*-------------------------------------------------------------*/
  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkill(value);
    debouncedFilterSuggestions(value);
  };
  /*-------------------------------------------------------------*/
  const handleSubmit = () => {
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
        .post("/api/job-posting", formData)
        .then(() => {
          toast.success("Posting job successfully");
          router.push("/jobs");
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
  /*-------------------------------------------------------------*/
  const isRewriteDisabled = useMemo(() => {
    return (
      !formData.title ||
      !formData.company_name ||
      !formData.location ||
      isAILoading
    );
  }, [formData.title, formData.company_name, formData.location, isAILoading]);
  /*-------------------------------------------------------------*/
  const handleDisable = () => {
    if (
      formData.title === "" ||
      formData.company_name === "" ||
      formData.location === "" ||
      formData.description === "" ||
      isAILoading ||
      isLoading
    ) {
      return true;
    }
    return false;
  };
  /*-------------------------------------------------------------*/
  return (
    <>
      <PreviewModal
        open={isReviewModalOpen}
        setOpen={setIsReviewModalOpen}
        formData={formData}
        user={user!}
      />
      <div className="flex w-[70%] flex-col overflow-x-hidden rounded-lg border bg-white shadow-md">
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
          <div className="flex max-w-full flex-shrink-0 items-center space-x-10 pb-3">
            <InputSugesstion
              formData={formData}
              setFormData={setFormData}
              isFocused={isJobFocused}
              setIsFocused={setIsJobFocused}
              label="Job title"
              isError={isJobError}
            />
            <div className="mt-1 flex w-1/2 flex-col space-y-[9px]">
              <p
                className={`${isCompanyError ? "text-red-500" : "text-muted-foreground"} max-[450px]:text-xs min-[450px]:text-sm`}
              >
                Company*
              </p>
              <input
                id="company"
                type="text"
                className={`rounded-md p-2 max-[450px]:text-xs min-[450px]:text-sm ${isCompanyError ? "outline outline-2 outline-red-500" : "border border-black"}`}
                value={formData.company_name}
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
            <div className="flex w-1/2 flex-col justify-end">
              <p className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm">
                Workplace type*
              </p>
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
              <p className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm">
                Job type*
              </p>
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
              <p className="text-muted-foreground max-[450px]:text-xs min-[450px]:text-sm">
                Level*
              </p>
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
          <Button
            disabled={isRewriteDisabled}
            onClick={generateDescription}
            variant="outline"
            className="flex w-fit items-center space-x-2 rounded-full px-4 outline outline-1 hover:outline-2"
          >
            {isAILoading ? (
              <AiOutlineLoading3Quarters className="size-4 animate-spin" /> // Loading spinner with animation
            ) : (
              <PiSparkleFill className="size-4" />
            )}
            <p>Rewrite with AI</p>
          </Button>
          <div>
            <p className="mb-4 font-semibold max-[450px]:text-lg min-[450px]:text-xl">
              Description*
            </p>
            <JobPostingDescription
              setFormData={setFormData}
              formData={formData}
              isError={isDescriptionError}
              triggerTypingAnimation={triggerTypingAnimation}
              setTriggerTypingAnimation={setTriggerTypingAnimation}
              setIsAILoading={setIsAILoading}
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
            {formData.required_skills.length > 0 &&
              formData.required_skills.map((skill, index) => (
                <Button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      required_skills: formData.required_skills.filter(
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
                disabled={formData.required_skills.length >= 10}
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
                    required_skills: [...formData.required_skills, skill],
                  });
                  setSkill("");
                  setSkillSuggestion([]);
                }}
                variant="ghost"
                className="rounded-full p-0 pr-2 hover:bg-transparent"
                disabled={formData.required_skills.length >= 10}
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
            }}
            variant="ghost"
            className="text-base text-blue-500 hover:bg-blue-100 hover:text-blue-700"
          >
            Preview
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="rounded-full bg-blue-500 text-lg text-white hover:bg-blue-700 hover:text-white"
            disabled={handleDisable()}
          >
            Post a job
          </Button>
        </div>
      </div>
    </>
  );
};

export default JobPostingMainContent;
