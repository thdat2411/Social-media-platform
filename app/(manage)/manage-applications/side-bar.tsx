"use client";
import CheckedIcon from "@/app/assets/check.png";
import RestoreIcon from "@/app/assets/clock.png";
import HiddenIcon from "@/app/assets/hidden.png";
import PencilIcon from "@/app/assets/pencil.png";
import ConfirmModal from "@/app/components/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import router from "next/router";
import React, { useState } from "react";
import { toast } from "sonner";
import { ManageJobPost } from "./main-content";

interface ManageApplicationSideBarProps {
  data: ManageJobPost;
  setData: React.Dispatch<React.SetStateAction<ManageJobPost[] | null>>;
  jobs: ManageJobPost[];
  setIsDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isSelection: boolean;
  setPostIndex: (index: number) => void;
}

const ManageApplicationSideBar = ({
  data,
  setData,
  jobs,
  setIsDetail,
  isSelection,
  setPostIndex,
}: ManageApplicationSideBarProps) => {
  const [isHideConfirmModalOpen, setIsHideConfirmModalOpen] = useState(false);
  const [isRestoreConfirmModalOpen, setIsRestoreConfirmModalOpen] =
    useState(false);
  const handleHidePost = async () => {
    try {
      await axios
        .put(`/api/manage?action=hide`, { id: data.id })
        .then((response) => {
          if (response.status === 200) {
            const updatedJobs = jobs.map((job) =>
              job.id === data.id ? { ...job, status: "hidden" } : job
            );
            setData(updatedJobs);
            setIsHideConfirmModalOpen(false);
            toast.success("Post hidden successfully");
          } else {
            toast.error("Error hiding post");
          }
        });
    } catch {
      toast.error("Error hiding post");
    }
  };
  const handleRestorePost = async () => {
    try {
      await axios
        .put(`/api/manage?action=restore`, { id: data.id })
        .then((response) => {
          if (response.status === 200) {
            const updatedJobs = jobs.map((job) =>
              job.id === data.id ? { ...job, status: "active" } : job
            );
            setData(updatedJobs);
            setIsRestoreConfirmModalOpen(false);
            toast.success("Post restore successfully");
          } else {
            toast.error("Error restoring post");
          }
        });
    } catch {
      toast.error("Error restoring post");
    }
  };
  return (
    <>
      <ConfirmModal
        open={isHideConfirmModalOpen}
        setOpen={setIsHideConfirmModalOpen}
        onClose={() => setIsHideConfirmModalOpen(false)}
        onConfirm={() => handleHidePost()}
        title="Hide post"
        content="Are you sure you want to hide this post?"
        cancelLabel="Cancel"
        confirmLabel="Hide"
        width="400"
      />
      <ConfirmModal
        open={isRestoreConfirmModalOpen}
        setOpen={setIsRestoreConfirmModalOpen}
        onClose={() => setIsRestoreConfirmModalOpen(false)}
        onConfirm={() => handleRestorePost()}
        title="Restore post"
        content="Are you sure you want to restore this post?"
        cancelLabel="Cancel"
        confirmLabel="Restore"
        width="400"
      />
      <div
        onClick={() => {
          setPostIndex(jobs.indexOf(data));
          setIsDetail(false);
        }}
        className={`flex cursor-pointer items-start justify-between space-x-4 border-b py-8 pl-10 pr-4 ${
          isSelection ? "border-b-2 border-l-2 border-l-black bg-slate-200" : ""
        }`}
      >
        <div className="flex">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold text-blue-600 hover:underline">
                {data.title}
              </p>
              {data.status === "active" ? (
                <Image src={CheckedIcon} alt="" className="size-6" />
              ) : (
                <Image src={HiddenIcon} alt="" className="size-6" />
              )}
            </div>

            <p className="text-sm font-medium text-green-600">
              {data.job_applications?.length === 0
                ? "No applications"
                : data.job_applications?.length + " applications"}
            </p>
            <p className="text-sm text-muted-foreground">
              created in{" "}
              {data.created_at
                ? format(new Date(data.created_at), "MMM dd, yyyy")
                : "Date not available"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full p-3 hover:bg-[#F4F2EE]"
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -right-6 flex w-[200px] flex-col items-center justify-start">
            <Button
              onClick={() => router.push(`/job-posting/edit/${data.id}`)}
              variant="ghost"
              className="flex w-full items-center justify-start space-x-2"
            >
              <Image src={PencilIcon} alt="" className="size-5" />
              <p>Edit post</p>
            </Button>
            {data.status === "active" ? (
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start space-x-2"
                onClick={() => setIsHideConfirmModalOpen(true)}
              >
                <Image src={HiddenIcon} alt="" className="size-5" />
                <p>Hide post</p>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start space-x-2"
                onClick={() => setIsRestoreConfirmModalOpen(true)}
              >
                <Image src={RestoreIcon} alt="" className="size-5" />
                <p>Restore the post</p>
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ManageApplicationSideBar;
