"use client";
import ConfirmModal from "@/app/components/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { BsFillPatchMinusFill } from "react-icons/bs";
import { toast } from "sonner";
import EditInfoModal from "./edit-info-modal";

interface EditIntroModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: user;
  setCurrentUser: (user: user) => void;
}

const EditIntroModal = ({
  open,
  setOpen,
  user,
  setCurrentUser,
}: EditIntroModalProps) => {
  const [data, setData] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    countryValue: user?.location ? user?.location.split(", ").slice(-1)[0] : "",
    cityValue: user?.location
      ? user?.location.split(", ").slice(0, -1).join(", ")
      : "",
    headLine: user?.headline ? user.headline : "",
  });
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    headLine: "",
    countryValue: "",
    cityValue: "",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        return value.trim() === "" ? "First name is required" : "";
      case "lastName":
        return value.trim() === "" ? "Last name is required" : "";
      case "headLine":
        return value.trim() === "" ? "Headline is required" : "";
      case "countryValue":
        return value.trim() === "" ? "Country/Region is required" : "";
      case "cityValue":
        return data.countryValue?.trim() !== "" && value.trim() === ""
          ? "Location is required"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        setData((prev) => ({ ...prev, firstName: value }));
        setErrors((prev) => ({
          ...prev,
          firstName: validateField("firstName", value),
        }));
        break;
      case "lastName":
        setData((prev) => ({ ...prev, lastName: value }));
        setErrors((prev) => ({
          ...prev,
          lastName: validateField("lastName", value),
        }));
        break;
      case "headLine":
        setData((prev) => ({ ...prev, headLine: value }));
        setErrors((prev) => ({
          ...prev,
          headline: validateField("headline", value),
        }));
        break;
      case "countryValue":
        setData((prev) => ({ ...prev, countryValue: value }));
        setErrors((prev) => ({
          ...prev,
          countryValue: validateField("countryValue", value),
        }));
        break;
      case "cityValue":
        setData((prev) => ({ ...prev, cityValue: value }));
        setErrors((prev) => ({
          ...prev,
          cityValue: validateField("cityValue", value),
        }));
        break;
    }
  };

  const onClose = () => {
    if (
      user &&
      data.firstName === user.name.split(" ")[0] &&
      data.lastName === user.name.split(" ").slice(1).join(" ") &&
      data.headLine == (user.headline ? user.headline : "") &&
      data.countryValue ==
        (user.location ? user.location?.split(", ").slice(-1)[0] : "") &&
      data.cityValue ==
        (user.location
          ? user.location?.split(", ").slice(0, -1).join(", ")
          : "")
    ) {
      setOpen(false);
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const onConfirm = () => {
    setIsConfirmModalOpen(false);
    setOpen(false);
    setData({
      firstName: user.name?.split(" ")[0] ?? "",
      lastName: user.name?.split(" ").slice(1).join(" ") ?? "",
      countryValue: user.location ? user.location.split(", ").slice(-1)[0] : "",
      cityValue: user.location
        ? user.location.split(", ").slice(0, -1).join(", ")
        : "",
      headLine: user.headline ?? "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      headLine: "",
      countryValue: "",
      cityValue: "",
    });
  };

  const onSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/in?action=edit-intro`, data);
      if (response.status === 200) {
        const { updatedUser } = response.data;
        setCurrentUser(updatedUser);
        setIsLoading(false);
        setOpen(false);
      } else {
        setIsLoading(false);
        toast.error(response.data.error);
      }
    } catch {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };
  if (!user) return null;

  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={onConfirm}
        title="Discard changes"
        content="Are you sure you want to discard the changes you made?"
        cancelLabel="No thanks"
        confirmLabel="Discard"
        width="400"
      />
      <EditInfoModal
        open={isEditContactModalOpen}
        setOpen={setIsEditContactModalOpen}
        user={user!}
        isNestedOpen={true}
        setUser={setCurrentUser}
      />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-2xl overflow-hidden bg-gray-50 p-0">
          <div className="rounded-lg border bg-white">
            <DialogHeader className="p-6">
              <DialogTitle className="text-xl font-medium">
                Edit intro
              </DialogTitle>
            </DialogHeader>
            <Separator className="p-0" />
            <div className="w-full space-y-8 p-6">
              <p className="text-xs text-muted-foreground">
                Indicate required*
              </p>

              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">First name*</p>
                <input
                  type="text"
                  value={data.firstName ?? ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <span className="flex items-center text-xs font-semibold text-red-500">
                    <BsFillPatchMinusFill className="mr-1 size-4" />
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Last name*</p>
                <input
                  type="text"
                  value={data.lastName ?? ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <span className="flex items-center text-xs font-semibold text-red-500">
                    <BsFillPatchMinusFill className="mr-1 size-4" />
                    {errors.lastName}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Headline*</p>
                <textarea
                  value={data.headLine ?? ""}
                  onChange={(e) =>
                    handleInputChange("headLine", e.target.value)
                  }
                  className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${
                    errors.headLine ? "border-red-500" : ""
                  }`}
                />
                {errors.headLine && (
                  <span className="flex items-center text-xs font-semibold text-red-500">
                    <BsFillPatchMinusFill className="mr-1 size-4" />
                    {errors.headLine}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Country/Region*</p>
                <input
                  type="text"
                  value={data.countryValue ?? ""}
                  onChange={(e) =>
                    handleInputChange("countryValue", e.target.value)
                  }
                  className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${
                    errors.countryValue ? "border-red-500" : ""
                  }`}
                />
                {errors.countryValue && (
                  <span className="flex items-center text-xs font-semibold text-red-500">
                    <BsFillPatchMinusFill className="mr-1 size-4" />
                    {errors.countryValue}
                  </span>
                )}
              </div>
              {data.countryValue && (
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-600">Location*</p>
                  <input
                    type="text"
                    value={data.cityValue ?? ""}
                    onChange={(e) =>
                      handleInputChange("cityValue", e.target.value)
                    }
                    className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${
                      errors.cityValue ? "border-red-500" : ""
                    }`}
                  />
                  {errors.cityValue && (
                    <span className="flex items-center text-xs font-semibold text-red-500">
                      <BsFillPatchMinusFill className="mr-1 size-4" />
                      {errors.cityValue}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <p className="text-lg font-semibold">Contact info</p>
                <p className="text-sm text-muted-foreground">
                  Add or edit your profile URL, email, and more
                </p>
                <Button
                  onClick={() => {
                    setIsEditContactModalOpen(true);
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="w-fit font-medium"
                >
                  Edit your info
                </Button>
              </div>
            </div>
            <Separator />
            <div className="w-full text-end">
              <Button
                disabled={
                  !data.firstName ||
                  !data.lastName ||
                  !data.countryValue ||
                  !data.headLine ||
                  isLoading
                }
                onClick={onSave}
                className="mb-6 mr-6 mt-5 rounded-full px-6 py-2"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditIntroModal;
