"use client";
import CompanyImage from "@/app/assets/company.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { job_posting, user } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import React, { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import Renderer from "../components/renderer";

interface PreviewModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: job_posting;
  user: user;
}

const PreviewModal = ({ open, setOpen, formData, user }: PreviewModalProps) => {
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll
    ? formData.required_skills
    : formData?.required_skills?.slice(0, 2);
  const additionalCount = formData?.required_skills?.length - 2;
  const avatarFallBack = user?.name.split(" ").pop()?.charAt(0).toUpperCase();

  const handleToggle = () => {
    setShowAll(!showAll);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-2xl bg-gray-50 p-0">
        <div className="flex flex-col rounded-lg border bg-white">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-medium">
              Preview job post
            </DialogTitle>
          </DialogHeader>
          <Separator className="p-0" />

          <div className="flex max-h-[70vh] flex-col overflow-y-auto p-6">
            <p className="pb-4 text-justify text-sm text-muted-foreground">
              This is a preview of what your job post will look like to job
              seekers, which includes details about your job such as company
              size and location, as well as information around when you created
              your LinkedIn profile. Candidates will answer screening questions
              when they apply.
            </p>
            <div className="flex flex-col rounded-lg border p-6">
              <Image
                src={CompanyImage}
                alt="Company Image"
                width={45}
                height={45}
              />
              <p className="mt-2 text-2xl font-semibold">{formData?.title}</p>
              <p className="mb-10 text-sm">
                {" "}
                · {formData?.location} ({formData?.workplace_type})
              </p>
              <div className="mb-2 flex items-center space-x-3 text-sm">
                <MdBusinessCenter className="size-6 text-[#666666]" />
                <p>
                  {formData?.job_type} · {formData?.level}{" "}
                </p>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <FaListCheck className="mr-1 size-5 text-[#666666]" />
                <p>
                  Skills:{" "}
                  {formData?.required_skills?.length === 0 ? (
                    <span className="text-muted-foreground">(None)</span>
                  ) : (
                    skillsToShow?.map((skill, index) => (
                      <span key={index}>
                        {skill}
                        {index < skillsToShow.length - 1 && ", "}
                      </span>
                    ))
                  )}
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
              <p className="my-3 text-sm text-muted-foreground">Posted by</p>
              <div className="mb-2 flex items-center space-x-2">
                <Avatar className="size-14">
                  <AvatarImage
                    src={user?.image ?? ""}
                    className="rounded-full"
                  />
                  <AvatarFallback className="bg-blue-300 text-2xl text-white">
                    {avatarFallBack}
                  </AvatarFallback>
                </Avatar>
                <div className="mb-3 flex flex-col">
                  <p className="font-medium">Thai Dat</p>
                  <p className="text-sm">
                    Student at HCMC University of Technology and Education
                  </p>
                </div>
              </div>
              <Renderer value={formData?.description} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
