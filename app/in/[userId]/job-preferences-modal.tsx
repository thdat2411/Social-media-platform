"use client";
import { getJobPreferences } from "@/app/actions/getJobPreferences";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { job_preference, user } from "@prisma/client";
import { Loader, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";

interface JobPreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: user;
  setUser: (user: user) => void;
}
const JobPreferenceModal = ({
  open,
  setOpen,
  user,
}: JobPreferenceModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobPreferences, setJobPreferences] = useState<job_preference>();
  useEffect(() => {
    const fetchJobPreferences = async () => {
      const jobPreferences = await getJobPreferences(user.id);
      if (jobPreferences) {
        setJobPreferences(jobPreferences);
      }
      setIsLoading(false);
    };
    fetchJobPreferences();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="absolute -mt-16 max-h-[800px] max-w-xl overflow-hidden bg-white">
        <DialogHeader className="p-2">
          <DialogTitle className="text-xl">Job preferences</DialogTitle>
        </DialogHeader>
        <Separator />
        {isLoading ? (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">
            <div className="flex flex-col items-center">
              <Loader className="size-10 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="size-16">
                  <AvatarImage
                    src={user?.image ?? ""}
                    className="rounded-full"
                  />
                  <AvatarFallback className="size-16 bg-blue-300 text-2xl font-medium text-white">
                    {user.name.split(" ").pop()?.charAt(0) ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-xl font-medium">{user.name}</p>
                  {jobPreferences?.start_date && (
                    <p className="text-base font-light">is open to work</p>
                  )}
                </div>
              </div>
              <Button className="rounded-full p-3" variant="ghost">
                <Pencil className="size-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-medium">Job titles</p>
              {jobPreferences?.job_titles ? (
                jobPreferences?.job_titles.map((title) => (
                  <p key={title} className="text-xs">
                    {title}
                  </p>
                ))
              ) : (
                <p className="text-xs">No job titles selected</p>
              )}
            </div>
            <div className="flex flex-col space-y-3 text-sm">
              <p className="font-medium">Location types</p>
              {jobPreferences?.location_type ? (
                jobPreferences?.location_type.map((type) => (
                  <p key={type} className="text-xs">
                    {type}
                  </p>
                ))
              ) : (
                <p className="text-xs">No location types selected</p>
              )}
            </div>
            {jobPreferences?.location_type?.includes("On-site") ? (
              <div className="flex flex-col space-y-3 text-sm">
                <p className="font-medium">Location (on-site)</p>
                <p className="text-xs">Viet Nam</p>
              </div>
            ) : null}
            {jobPreferences?.location_type?.includes("Remote") ? (
              <div className="flex flex-col space-y-3 text-sm">
                <p className="font-medium">Location (remote)</p>
                <p className="text-xs">Viet Nam</p>
              </div>
            ) : null}
            <div className="flex flex-col space-y-3 pb-4 text-sm">
              <p className="font-medium">Start date</p>
              <p className="text-xs">
                {jobPreferences?.start_date
                  ? jobPreferences.start_date
                  : "Not set yet"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobPreferenceModal;
