"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useState } from "react";
import CompanyImage from "@/app/assets/company.png";
import { FormDataType } from "./main-content";
import { FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Renderer from "../components/renderer";

interface PreviewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: FormDataType;
}

const PreviewModal = ({ open, setOpen, formData }: PreviewModalProps) => {
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll ? formData.skills : formData.skills.slice(0, 2);
  const additionalCount = formData.skills.length - 2;

  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 w-full max-w-2xl ">
        <div className="bg-white border rounded-lg flex flex-col">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-medium">
              Preview job post
            </DialogTitle>
          </DialogHeader>
          <Separator className="p-0" />

          <div className="flex flex-col p-6 max-h-[70vh] overflow-y-auto">
            <p className="text-muted-foreground text-sm pb-4 text-justify">
              This is a preview of what your job post will look like to job
              seekers, which includes details about your job such as company
              size and location, as well as information around when you created
              your LinkedIn profile. Candidates will answer screening questions
              when they apply.
            </p>
            <div className="border p-6 rounded-lg flex flex-col">
              <Image
                src={CompanyImage}
                alt="Company Image"
                width={45}
                height={45}
              />
              <p className="font-semibold text-2xl mt-2">{formData.jobTitle}</p>
              <p className="text-sm mb-10">
                {" "}
                · {formData.jobLocation} ({formData.workplaceType})
              </p>
              <div className="flex space-x-3 text-sm items-center mb-2">
                <MdBusinessCenter className="size-6 text-[#666666]" />
                <p>
                  {formData.jobType} · {formData.level}{" "}
                </p>
              </div>
              <div className="flex space-x-3 text-sm items-center ">
                <FaListCheck className="size-5 text-[#666666] mr-1" />
                <p>
                  Skills:{" "}
                  {formData.skills.length === 0 && (
                    <span className="text-muted-foreground">(None)</span>
                  )}
                  {skillsToShow.map((skill, index) => (
                    <span key={index}>
                      {skill}
                      {index < skillsToShow.length - 1 && ", "}
                    </span>
                  ))}
                  {additionalCount > 0 && !showAll && (
                    <button
                      onClick={handleToggle}
                      className="text-blue-600 hover:underline"
                    >
                      , +{additionalCount} more
                    </button>
                  )}
                </p>
              </div>
              <p className="text-muted-foreground text-sm my-3">Posted by</p>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="size-12 rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col mb-3">
                  <p className="font-medium">Thai Dat</p>
                  <p className="text-sm">
                    Student at HCMC University of Technology and Education
                  </p>
                </div>
              </div>
              <Renderer value={formData.description} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
