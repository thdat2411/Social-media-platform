"use client";
import ConfirmModal from "@/app/components/confirm-modal";
import { coverLetterSample } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { job_application, user } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { toast } from "sonner";

const CoverLetter = dynamic(() => import("./cover-letter"), {
  ssr: false,
});

interface ApplicantModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: user;
  jobPostId: string;
}

const ApplicantModal = ({
  open,
  setOpen,
  user,
  jobPostId,
}: ApplicantModalProps) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState<job_application | null>({
    id: "",
    created_at: null,
    updated_at: null,
    job_listing_id: jobPostId,
    user_id: user.id,
    resume_url: null,
    cover_letter: coverLetterSample,
    status: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent): void => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setIsValid(false);
      return;
    }
    setCvFile(file);
    setIsValid(true);
  };

  const handleClick = () => {
    if (formData?.cover_letter === "" || !cvFile) {
      toast.error("Please fill out all required fields");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleSubmit = async () => {
    if (formData?.cover_letter === "" || !cvFile) {
      toast.error("Please fill out all required fields");
      return;
    }

    setIsLoading(true);
    setIsConfirmModalOpen(false);
    const CVdata = new FormData();
    CVdata.append("file", cvFile);

    try {
      const response = await axios.post("/api/cv-upload", CVdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      setFormData((prevFormData) => ({
        ...prevFormData!,
        resume_url: data.url,
      }));

      const updatedFormData = {
        ...formData!,
        resume_url: data.url,
      };

      const jobResponse = await axios.post(
        `/api/jobs/view/${jobPostId}`,
        updatedFormData
      );
      if (jobResponse.status === 200) {
        setIsConfirmModalOpen(false);
        toast.success("Application submitted successfully");
        setOpen(false);
        setCvFile(null);
      } else {
        toast.error("Failed to upload application");
      }
    } catch (err) {
      console.error(
        "Error uploading file to Cloudinary:",
        (err as AxiosError).response?.data
      );
      toast.error("Failed to upload file");
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSubmit}
        title="Are you sure?"
        content="Are you sure you want to apply for this job?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        width="500"
      />
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent
          className="w-full max-w-3xl overflow-hidden bg-gray-50 p-0"
          aria-description={"Apply for Job"}
        >
          {isLoading && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="flex flex-col items-center">
                <Loader className="size-10 animate-spin" />
              </div>
            </div>
          )}
          <div className="rounded-lg border bg-white">
            <DialogHeader className="p-6">
              <DialogTitle className="text-xl font-medium">
                Apply for Job
              </DialogTitle>
              <DialogDescription hidden>Fixed the warning</DialogDescription>
            </DialogHeader>
            <Separator className="p-0" />

            <div className="flex flex-col p-6">
              <div
                className={`flex w-full flex-col space-y-4 ${isValid ? "bg-white" : "bg-red-300"}`}
              >
                <div className="flex w-full flex-col space-y-4">
                  <p className="text-xl font-medium">Write cover letter</p>
                  <CoverLetter formData={formData!} setFormData={setFormData} />
                </div>
                <div className="flex w-full flex-col space-y-4">
                  <p className="text-xl font-medium">
                    Upload your CV (PDF) here
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mt-4 self-start rounded-md border p-2"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    disabled={isLoading}
                    variant="ghost"
                    className="mr-3 rounded-full"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isLoading}
                    className="rounded-full bg-blue-500 text-white hover:bg-blue-700"
                    onClick={handleClick}
                  >
                    Apply
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicantModal;
