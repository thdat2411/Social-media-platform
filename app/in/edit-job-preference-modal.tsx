import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import ConfirmModal from "../components/confirm-modal";
import ButtonTransferInput from "./button-transfer-input";
import TypeSelection from "./type-selection";

interface EditJobPreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EditJobPreferenceModal = ({
  open,
  setOpen,
}: EditJobPreferenceModalProps) => {
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [isTitleAdding, setIsTitleAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [locationOnSite, setLocationOnSite] = useState<string[]>([]);
  const [isLocationOnSiteAdding, setIsLocationOnSiteAdding] = useState(false);
  const [newOnSiteLocation, setNewOnSiteLocation] = useState("");
  const [locationRemote, setLocationRemote] = useState<string[]>([]);
  const [isLocationRemoteAdding, setIsLocationRemoteAdding] = useState(false);
  const [newRemoteLocation, setNewRemoteLocation] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
        setLocationOnSite([]);
      } else {
        setLocationRemote([]);
      }
    } else {
      setLocationTypes([...locationTypes, type]);
    }
  };

  const handleAddTitle = () => {
    if (newTitle.trim()) {
      setJobTitles([...jobTitles, newTitle]);
      setNewTitle("");
    }
    setIsTitleAdding(false);
  };

  const handleAddOnSiteLocation = () => {
    if (newOnSiteLocation.trim()) {
      setLocationOnSite([...locationOnSite, newOnSiteLocation]);
      setNewOnSiteLocation("");
    }
    setIsLocationOnSiteAdding(false);
  };
  const handleAddRemoteLocation = () => {
    if (newRemoteLocation.trim()) {
      setLocationRemote([...locationRemote, newRemoteLocation]);
      setNewRemoteLocation("");
    }
    setIsLocationRemoteAdding(false);
  };

  const handleElementType = (type: string) => {
    if (employmentTypes.includes(type)) {
      setEmploymentTypes(employmentTypes.filter((item) => item !== type));
    } else {
      setEmploymentTypes([...employmentTypes, type]);
    }
  };
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
            <DialogTitle className="text-xl">User Name</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex h-[500px] flex-col space-y-8 overflow-y-auto px-2 pb-10">
            <p className="text-xs text-muted-foreground">*Indicate required</p>
            {/*Job titles*/}
            <ButtonTransferInput
              title="Job titles*"
              data={jobTitles}
              setData={setJobTitles}
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
              <ButtonTransferInput
                title="Location (on-site)*"
                data={locationOnSite}
                setData={setLocationOnSite}
                isAdding={isLocationOnSiteAdding}
                setIsAdding={setIsLocationOnSiteAdding}
                newValue={newOnSiteLocation}
                setNewValue={setNewOnSiteLocation}
                handleFunction={handleAddOnSiteLocation}
              />
            )}
            {/*Location (Remote)*/}
            {locationTypes.includes("Remote") && (
              <ButtonTransferInput
                title="Location (remote)*"
                data={locationRemote}
                setData={setLocationRemote}
                isAdding={isLocationRemoteAdding}
                setIsAdding={setIsLocationRemoteAdding}
                newValue={newRemoteLocation}
                setNewValue={setNewRemoteLocation}
                handleFunction={handleAddRemoteLocation}
              />
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
                    setStartDate("Immediately, I am actively applying")
                  }
                  checked={startDate === "Immediately, I am actively applying"}
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
                    setStartDate("Flexible, I am casually looking")
                  }
                  checked={startDate === "Flexible, I am casually looking"}
                />
                <label htmlFor="flexible" className="text-sm">
                  Flexible, I am casually looking
                </label>
              </div>
            </div>
            {/*Employment types*/}
            <TypeSelection
              title="Employment types*"
              types={employmentTypes}
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
