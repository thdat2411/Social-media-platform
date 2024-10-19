"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera } from "lucide-react";
import React, { useState } from "react";
import CroppieModal from "../in/croppie-modal";
import PictureModal from "../in/pic-modal";
import UserInformation from "./user-information";

const SettingPage = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const [isAvatarImage, setIsAvatarImage] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isCroppieModalOpen, setIsCroppieModalOpen] = useState(false);

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
      <div className="mx-auto my-7 max-w-4xl rounded-lg border bg-white shadow-md">
        <div className="flex flex-col">
          <div className="relative">
            <div className="h-40 rounded-t-lg bg-gray-200">
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
                          document.getElementById("avatarImageUpload")?.click();
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
            <div className="absolute left-1/2 top-16 -translate-x-1/2 transform">
              <DropdownMenu
                open={isAvatarDropdownOpen}
                onOpenChange={setIsAvatarDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      className="size-44 cursor-pointer rounded-full"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
          <UserInformation />
        </div>
      </div>
    </>
  );
};

export default SettingPage;
