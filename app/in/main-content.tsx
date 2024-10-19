"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Pencil } from "lucide-react";
import React, { useState } from "react";
import ListUser from "../components/list-user";
import EventModal from "../feed/components/event-modal";
import MediaModal from "../feed/components/media-modal";
import PostModal, { Event } from "../feed/components/post-modal";
import ContactInfoModal from "./contact-info-modal";
import CroppieModal from "./croppie-modal";
import EditJobPreferenceModal from "./edit-job-preference-modal";
import JobPreferenceModal from "./job-preferences-modal";
import PictureModal from "./pic-modal";
import UserActivity from "./user-activity";

const UserProfileMainContent = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isCroppieModalOpen, setIsCroppieModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [nestedMediaModal, setNestedMediaModal] = useState(false);
  const [nestedEventModal, setNestedEventModal] = useState(false);
  const [formData, setFormData] = useState<Event | undefined>(undefined);
  const [isAvatarImage, setIsAvatarImage] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isEditReferenceModalOpen, setIsEditReferenceModalOpen] =
    useState(false);
  const [isJobPreferenceModalOpen, setIsJobPreferenceModalOpen] =
    useState(false);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsCroppieModalOpen(true);
    }
  };
  return (
    <>
      <CroppieModal
        open={isCroppieModalOpen}
        setOpen={setIsCroppieModalOpen}
        image={userAvatar}
        setImage={setUserAvatar}
        isAvatarImage={isAvatarImage}
      />
      <PictureModal
        open={isPicModalOpen}
        setOpen={setIsPicModalOpen}
        image={"https://github.com/shadcn.png"}
      />
      <ContactInfoModal
        open={isContactInfoModalOpen}
        setOpen={setIsContactInfoModalOpen}
      />
      <EditJobPreferenceModal
        open={isEditReferenceModalOpen}
        setOpen={setIsEditReferenceModalOpen}
      />
      <JobPreferenceModal
        open={isJobPreferenceModalOpen}
        setOpen={setIsJobPreferenceModalOpen}
      />
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={null}
        setIsOpenEditModal={setIsOpenEditModal}
        setIsEventModalOpen={setIsEventModalOpen}
        setNestedEventModal={setNestedEventModal}
        setNestedMediaModal={setNestedMediaModal}
        event={formData}
        setEvent={setFormData}
      />
      <MediaModal
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        nestedMediaModal={nestedMediaModal}
        setNestedMediaModal={setNestedMediaModal}
      />
      <EventModal
        open={isEventModalOpen}
        setOpen={setIsEventModalOpen}
        nestedEventModal={nestedEventModal}
        setNestedEventModal={setNestedEventModal}
        formData={formData}
        setFormData={setFormData}
      />
      <div className="flex w-full space-x-20">
        <div className="flex w-2/3 flex-col">
          <div className="rounded-lg border bg-white shadow-md">
            <div className="relative">
              <div className="h-36 rounded-t-lg bg-gray-200">
                <div className="flex justify-end p-2">
                  <DropdownMenu
                    open={isBgDropdownOpen}
                    onOpenChange={setIsBgDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="cursor-pointer rounded-full bg-white p-3"
                      >
                        <Camera className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute -right-4">
                      <div className="flex w-full flex-col space-y-2 p-1">
                        <Button
                          onClick={() => {
                            setIsPicModalOpen(true);
                            setIsBgDropdownOpen(false);
                          }}
                          variant="ghost"
                          className="flex w-full justify-start"
                        >
                          <p>Show Image</p>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex w-full justify-start"
                          onClick={() => {
                            document
                              .getElementById("avatarImageUpload")
                              ?.click();
                            setIsBgDropdownOpen(false);
                          }}
                        >
                          Change background photo
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    type="file"
                    accept="image/*"
                    id="bgImageUpload"
                    className="hidden"
                    onChange={(e) => {
                      handleFileChange(e);
                      setIsAvatarImage(false);
                    }}
                  />
                </div>
              </div>
              <div className="absolute left-4 top-12">
                <DropdownMenu
                  open={isAvatarDropdownOpen}
                  onOpenChange={setIsAvatarDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        className="size-36 cursor-pointer rounded-full"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute -left-16 top-2">
                    <div className="flex w-full flex-col space-y-2 p-1">
                      <Button
                        onClick={() => {
                          setIsAvatarDropdownOpen(false);
                          setIsPicModalOpen(true);
                        }}
                        variant="ghost"
                        className="flex w-full justify-start"
                      >
                        <p>Show Image</p>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex w-full justify-start"
                        onClick={() => {
                          document.getElementById("avatarImageUpload")?.click();
                          setIsAvatarDropdownOpen(false);
                        }}
                      >
                        Change profile photo
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  type="file"
                  accept="image/*"
                  id="avatarImageUpload"
                  className="hidden"
                  onChange={(e) => {
                    handleFileChange(e);
                    setIsAvatarImage(true);
                  }}
                />
              </div>
            </div>
            <div className="mt-20 px-6 pb-6">
              <h1 className="text-2xl font-semibold">
                Thái Đạt <i className="fas fa-check-circle text-blue-500"></i>
              </h1>
              <p className="text-gray-600">
                Student at HCMC University of Technology and Education
              </p>
              <p className="text-sm text-muted-foreground">
                Thủ Đức, Ho Chi Minh City, Vietnam ·{" "}
                <span
                  onClick={() => setIsContactInfoModalOpen(true)}
                  className="cursor-pointer font-semibold text-blue-600 hover:underline"
                >
                  Contact info
                </span>
              </p>
            </div>
            <div className="mb-4 ml-4 flex w-1/2 justify-between rounded-lg bg-[#DDE7F1] px-6 py-4">
              <div className="flex cursor-pointer flex-col space-y-1 text-sm">
                <p className="text-base font-medium">Open to work</p>
                <p>User preference roles</p>
                <p
                  onClick={() => setIsJobPreferenceModalOpen(true)}
                  className="font-medium text-blue-500 hover:underline"
                >
                  Show details
                </p>
              </div>
              <Button
                onClick={() => setIsEditReferenceModalOpen(true)}
                variant="ghost"
                className="rounded-full px-3"
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          </div>
          <UserActivity setIsPostModalOpen={setIsPostModalOpen} />
        </div>
        <ListUser />
      </div>
    </>
  );
};

export default UserProfileMainContent;
