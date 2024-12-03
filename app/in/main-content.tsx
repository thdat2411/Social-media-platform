"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { post, user } from "@prisma/client";
import axios from "axios";
import { Camera, Loader, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ListUser from "../components/list-user";
import { Event } from "../feed/components/post-modal";
import MyItemsFooter from "../my-items/footer";
import UserActivity from "./user-activity";

const EditIntroModal = dynamic(() => import("./edit-intro-modal"), {
  ssr: false,
});

const CroppieModal = dynamic(() => import("./croppie-modal"), {
  ssr: false,
});

const PictureModal = dynamic(() => import("./pic-modal"), {
  ssr: false,
});

const ContactInfoModal = dynamic(() => import("./contact-info-modal"), {
  ssr: false,
});

const EditJobPreferenceModal = dynamic(
  () => import("./edit-job-preference-modal"),
  {
    ssr: false,
  }
);

const PostModal = dynamic(() => import("../feed/components/post-modal"), {
  ssr: false,
});

const MediaModal = dynamic(() => import("../feed/components/media-modal"), {
  ssr: false,
});

const EventModal = dynamic(() => import("../feed/components/event-modal"), {
  ssr: false,
});

const JobPreferenceModal = dynamic(() => import("./job-preferences-modal"), {
  ssr: false,
});

interface UserProfileMainContentProps {
  user: user;
  users: user[];
}

const UserProfileMainContent = ({
  users,
  user,
}: UserProfileMainContentProps) => {
  const userId = useSearchParams().get("userId");
  const [userProfile, setUserProfile] = useState<user | null>(null);
  const [currentUser, setCurrentUser] = useState<user | null>(user);
  const [userPosts, setUserPosts] = useState<post[]>([]);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isCroppieModalOpen, setIsCroppieModalOpen] = useState(false);
  const [isAvatarImage, setIsAvatarImage] = useState(false);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isEditIntroOpen, setIsEditIntroOpen] = useState(false);
  const [isEditReferenceModalOpen, setIsEditReferenceModalOpen] =
    useState(false);
  const [isJobPreferenceModalOpen, setIsJobPreferenceModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(`/api/in/get-user?userId=${userId}`),
          axios.get(`/api/in/get-user-posts?userId=${userId}`),
        ]);

        if (userResponse.status === 200) {
          setUserProfile(userResponse.data.user);
        } else {
          console.error("Failed to fetch user");
        }

        if (postsResponse.status === 200) {
          setUserPosts(postsResponse.data.posts);
        } else {
          console.error("Failed to fetch user posts");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    setCurrentUser(user);
  }, [userId]);
  if (isLoading)
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-200 bg-opacity-50">
        <div className="flex flex-col items-center">
          <Loader className="size-10 animate-spin" />
        </div>
      </div>
    );
  else {
    return (
      <>
        <EditIntroModal
          open={isEditIntroOpen}
          setOpen={setIsEditIntroOpen}
          user={userProfile!}
          setCurrentUser={setUserProfile}
        />
        <CroppieModal
          open={isCroppieModalOpen}
          setOpen={setIsCroppieModalOpen}
          image={userAvatar}
          setImage={setUserAvatar}
          isAvatarImage={isAvatarImage}
          userId={userProfile?.id || ""}
        />
        <PictureModal
          open={isPicModalOpen}
          setOpen={setIsPicModalOpen}
          image={userProfile?.image ?? ""}
        />
        <ContactInfoModal
          open={isContactInfoModalOpen}
          setOpen={setIsContactInfoModalOpen}
          userProfile={userProfile!}
          setUserProfile={setUserProfile}
          user={user}
        />
        <EditJobPreferenceModal
          open={isEditReferenceModalOpen}
          setOpen={setIsEditReferenceModalOpen}
          userId={userProfile?.id!}
        />
        <JobPreferenceModal
          open={isJobPreferenceModalOpen}
          setOpen={setIsJobPreferenceModalOpen}
          userProfile={userProfile!}
          setUserProfile={setUserProfile}
          user={user}
        />
        <div className="flex h-full flex-col justify-between">
          <div className="flex w-full justify-around max-[1000px]:flex-col max-[1000px]:items-center max-[1000px]:space-y-6">
            <div className="flex w-[60%] flex-col max-[1000px]:w-[85%]">
              <div className="rounded-lg border bg-white shadow-md">
                <div className="relative">
                  <div className="h-36 rounded-t-lg bg-gray-200">
                    {userProfile?.id === currentUser?.id && (
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
                    )}
                  </div>

                  <div className="absolute left-4 top-12">
                    <DropdownMenu
                      open={isAvatarDropdownOpen}
                      onOpenChange={setIsAvatarDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Avatar className="size-36 cursor-pointer max-[1400px]:size-32">
                          <AvatarImage
                            src={userProfile?.image ?? ""}
                            className="cursor-pointer rounded-full"
                          />
                          <AvatarFallback className="bg-blue-300 text-[60px] text-white">
                            {userProfile
                              ?.full_name!.split(" ")
                              .pop()
                              ?.charAt(0) || ""}
                          </AvatarFallback>
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
                          {currentUser?.id === userProfile?.id && (
                            <Button
                              variant="ghost"
                              className="flex w-full justify-start"
                              onClick={() => {
                                document
                                  .getElementById("avatarImageUpload")
                                  ?.click();
                                setIsAvatarDropdownOpen(false);
                              }}
                            >
                              Change profile photo
                            </Button>
                          )}
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
                  {userProfile?.id === currentUser?.id && (
                    <div className="aboslute flex justify-end p-4">
                      <Button
                        onClick={() => setIsEditIntroOpen(true)}
                        variant={"ghost"}
                        className="rounded-full p-3"
                      >
                        <Pencil className="size-6" />
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className={`px-6 pb-10 ${userProfile?.id !== currentUser?.id ? "mt-16" : "mt-1"}`}
                >
                  <h1 className="text-2xl font-semibold">
                    {userProfile?.full_name}{" "}
                    <i className="fas fa-check-circle text-blue-500"></i>
                  </h1>
                  <p className="text-gray-600">{userProfile?.headline ?? ""}</p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.location ? userProfile!.location + "·" : ""}
                    <span
                      onClick={() => setIsContactInfoModalOpen(true)}
                      className="cursor-pointer font-semibold text-blue-600 hover:underline"
                    >
                      {" "}
                      Contact info
                    </span>
                  </p>
                </div>
                {userProfile?.role !== "recruiter" && (
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
                    {userProfile?.id === currentUser?.id && (
                      <Button
                        onClick={() => setIsEditReferenceModalOpen(true)}
                        variant="ghost"
                        className="rounded-full px-3"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {/* User activity */}
              <UserActivity user={userProfile!} userPosts={userPosts} />
            </div>
            <ListUser users={users} />
          </div>
          <MyItemsFooter />
        </div>
      </>
    );
  }
};

export default UserProfileMainContent;
