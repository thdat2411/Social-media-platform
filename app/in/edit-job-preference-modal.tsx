import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { job_preference } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { getJobPreferences } from "../actions/getJobPreferences";
import ConfirmModal from "../components/confirm-modal";
import ButtonTransferInput from "./button-transfer-input";
import TypeSelection from "./type-selection";

interface EditJobPreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}

const EditJobPreferenceModal = ({
  open,
  setOpen,
  userId,
}: EditJobPreferenceModalProps) => {
  const [isTitleAdding, setIsTitleAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobPreferences, setJobPreferences] = useState<job_preference>();
  const [updatedData, setUpdatedData] = useState<job_preference>();
  useEffect(() => {
    const fetchJobPreferences = async () => {
      const jobPreferences = await getJobPreferences(userId);
      if (jobPreferences) {
        setJobPreferences(jobPreferences);
        setUpdatedData(jobPreferences);
      }
      setIsLoading(false);
    };
    fetchJobPreferences();
  });

  const employmentValue = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const [locationTypes, setLocationTypes] = useState<string[]>([
    "On-site",
    "Remote",
  ]);
  const locationValue = ["On-site", "Remote", "Hybrid"];

  const handleLocationType = (type: string) => {
    if (locationTypes.includes(type)) {
      setLocationTypes(locationTypes.filter((item) => item !== type));
      if (type === "On-site" || type === "Hybrid") {
        setUpdatedData({ ...updatedData!, location_on_site: "" });
      } else {
        setUpdatedData({ ...updatedData!, location_remote: "" });
      }
    } else {
      setLocationTypes([...locationTypes, type]);
    }
  };

  const handleAddTitle = () => {
    if (newTitle.trim()) {
      setUpdatedData({
        ...updatedData!,
        job_titles: [...(updatedData?.job_titles || []), newTitle],
      });
      setNewTitle("");
    }
    setIsTitleAdding(false);
  };

  const handleElementType = (type: string) => {
    if (employmentTypes.includes(type)) {
      setEmploymentTypes(employmentTypes.filter((item) => item !== type));
    } else {
      setEmploymentTypes([...employmentTypes, type]);
    }
  };

  const insertJobTitle = (job_titles: string) => {
    setUpdatedData({
      ...updatedData!,
      job_titles: [...(updatedData?.job_titles || []), job_titles],
    });
  };

  if (isLoading) {
    return null;
  }
  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        title="Discard changes?"
        content="You have unsaved changes. Are you sure you want to discard?"
        cancelLabel="Cancel"
        confirmLabel="Discard"
        width="400"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="absolute -mt-8 max-h-[800px] max-w-xl overflow-hidden bg-white">
          <DialogHeader className="p-3">
            <DialogTitle className="text-xl">Edit job preference</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex h-[500px] flex-col space-y-8 overflow-y-auto px-2 pb-10">
            <p className="text-xs text-muted-foreground">*Indicate required</p>
            {/*Job titles*/}
            <ButtonTransferInput
              title="Job titles*"
              data={updatedData?.job_titles || []}
              setData={() => insertJobTitle}
              isAdding={isTitleAdding}
              setIsAdding={setIsTitleAdding}
              newValue={newTitle}
              setNewValue={setNewTitle}
              handleFunction={handleAddTitle}
            />
            {/*Location types*/}
            <TypeSelection
              title="Location types*"
              types={locationTypes}
              values={locationValue}
              handleFunction={handleLocationType}
            />
            {/*Location (On-site)*/}
            {(locationTypes.includes("On-site") ||
              locationTypes.includes("Hybrid")) && (
              <div className="flex w-full flex-col items-center justify-between space-y-2">
                <p className="self-start text-sm text-muted-foreground">
                  Location (On-site)*
                </p>
                <input
                  type="text"
                  value={updatedData?.location_on_site || ""}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData!,
                      location_on_site: e.target.value,
                    })
                  }
                  className="w-full border-2 px-2 py-1 text-sm"
                  placeholder="Enter location"
                />
              </div>
            )}
            {/*Location (Remote)*/}
            {locationTypes.includes("Remote") && (
              <div className="flex w-full flex-col items-center justify-between space-y-2">
                <p className="self-start text-sm text-muted-foreground">
                  Location (Remote)*
                </p>
                <input
                  type="text"
                  value={updatedData?.location_remote || ""}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData!,
                      location_remote: e.target.value,
                    })
                  }
                  className="w-full border-2 px-2 py-1 text-sm"
                  placeholder="Enter locatiton"
                />
              </div>
            )}
            {/*Start date*/}
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Start date</p>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="immediate"
                  name="eventType"
                  className="mr-2 size-6"
                  onClick={() =>
                    setUpdatedData({
                      ...updatedData!,
                      start_date: "Immediately, I am actively applying",
                    })
                  }
                  checked={
                    updatedData?.start_date ===
                    "Immediately, I am actively applying"
                  }
                />
                <label htmlFor="immediate" className="text-sm">
                  Immediately, I am actively applying
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="flexible"
                  name="eventType"
                  className="mr-2 size-6"
                  onClick={() =>
                    setUpdatedData({
                      ...updatedData!,
                      start_date: "Flexible, I am casually looking",
                    })
                  }
                  checked={
                    updatedData?.start_date ===
                    "Flexible, I am casually looking"
                  }
                />
                <label htmlFor="flexible" className="text-sm">
                  Flexible, I am casually looking
                </label>
              </div>
            </div>
            {/*Employment types*/}
            <TypeSelection
              title="Employment types*"
              types={updatedData?.employment_types || []}
              values={employmentValue}
              handleFunction={handleElementType}
            />
          </div>
          <Separator />
          <DialogFooter className="flex items-center justify-end">
            <Button
              variant="ghost"
              className="rounded-full bg-blue-500 px-6 py-2 text-white hover:bg-blue-700 hover:text-white"
              onClick={() => setIsConfirmModalOpen(true)}
            >
              <p>Save</p>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditJobPreferenceModal;
