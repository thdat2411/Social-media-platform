"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, X } from "lucide-react";
import { FaRegSmile } from "react-icons/fa";
import { Hint } from "../../components/hint";
import { MdCalendarMonth, MdOutlinePermMedia } from "react-icons/md";
import { EmojiPopover } from "../../components/emoji-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactPhotoEditor } from "react-photo-editor";
import ConfirmModal from "../../components/confirm-modal";
import { useDebounce } from "use-debounce";
import Event from "./event-post-field";
import EventPostField from "./event-post-field";
import { defaultEvent } from "@/app/utils/utils";
import { user } from "@prisma/client";
export type Event = {
  eventName: string;
  description: string;
  address: string;
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isInPerson: boolean;
  zone: string;
  headerImage: string;
};

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image?: File | null | undefined;
  setImage?: (image: File | null) => void;
  draftImage?: string | null;
  draftContent?: string | null;
  setDraftContent?: (draft: string | null) => void;
  setDraftImage?: (image: string | null) => void;
  setIsOpenEditModal?: (open: boolean) => void;
  setIsEventModalOpen?: (open: boolean) => void;
  setIsHavingText?: (value: boolean) => void;
  setTriggerReset?: (value: boolean) => void;
  setNestedMediaModal?: (value: boolean) => void;
  setNestedEventModal?: (value: boolean) => void;
  event?: Event | undefined;
  setEvent?: (event: Event | undefined) => void;
  isIn?: boolean;
  user: user;
}

const PostModal = ({
  open,
  setOpen,
  image,
  setImage,
  draftContent,
  draftImage,
  setDraftContent,
  setDraftImage,
  setIsOpenEditModal,
  setIsEventModalOpen,
  event,
  setIsHavingText,
  setTriggerReset,
  setNestedMediaModal,
  setNestedEventModal,
  setEvent,
  isIn,
  user,
}: PostModalProps) => {
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [debouncedPostContent] = useDebounce(postContent, 300);
  const avatarFallBack = user?.name.split(" ").pop()?.charAt(0).toUpperCase();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };

  useEffect(() => {
    if (draftContent) {
      setDraftContent?.(debouncedPostContent);
    }
    if (draftImage) {
      setEditedImage(draftImage);
    }
  }, [draftContent, draftImage, debouncedPostContent, setDraftContent]);

  useEffect(() => {
    if (open) {
      const reader = new FileReader();
      if (image) {
        reader.onloadend = () => {
          setEditedImage(reader.result as string);
        };
        reader.readAsDataURL(image);
      }
      return () => {
        reader.abort();
      };
    }
  }, [image]);

  const handleSaveDraft = () => {
    if (postContent.trim() !== "") {
      setDraftContent?.(postContent);
      localStorage.setItem("draftContent", JSON.stringify(postContent));
    }
    if (editedImage !== null) {
      setDraftImage?.(editedImage);
      localStorage.setItem("draftImage", JSON.stringify(editedImage));
    }
    setIsHavingText?.(false);
    setTriggerReset?.(true);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("draftContent");
    localStorage.removeItem("draftImage");
    setDraftContent?.(null);
    setDraftImage?.(null);
    setPostContent("");
    setEditedImage(null);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleClose = () => {
    if (
      (postContent.trim() !== "" ||
        editedImage !== null ||
        event !== undefined) &&
      isIn === false
    ) {
      setIsConfirmModalOpen(true);
    } else {
      const draftContent = localStorage.getItem("draftContent");
      const draftImage = localStorage.getItem("draftImage");
      if (draftContent || draftImage) {
        if (draftContent) {
          localStorage.removeItem("draftContent");
          setDraftContent?.(null);
        }
        if (draftImage) {
          localStorage.removeItem("draftImage");
          setDraftImage?.(null);
        }
      }

      setNestedEventModal?.(false);
      setNestedMediaModal?.(false);
      setOpen(false);
    }
  };

  const handleSaveImage = (editedFile: File) => {
    setEditedImage(URL.createObjectURL(editedFile));
  };

  const handleEditButton = async () => {
    if (editedImage !== null) {
      const fileName = "draft-image.jpg";
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const draftImageFile = new File([blob], fileName, { type: blob.type });
      setImage?.(draftImageFile);
      setIsPhotoEditorOpen(true);
      console.log(isPhotoEditorOpen);
      console.log(image);
    } else if (event !== undefined) {
      setIsEventModalOpen?.(true);
    }
    setOpen(false);
  };

  const handleOpenEvent = () => {
    setIsEventModalOpen?.(true);
    setEvent?.(defaultEvent);

    setOpen(false);
    setNestedEventModal?.(true);
  };

  const handleDeleteButton = () => {
    if (event !== undefined) {
      setEvent?.(undefined);
    }
    if (editedImage !== null) {
      setEditedImage(null);
    }
  };
  return (
    <>
      <ReactPhotoEditor
        open={isPhotoEditorOpen}
        file={image || undefined}
        onSaveImage={handleSaveImage}
        onClose={() => {
          setIsPhotoEditorOpen(false);
          setOpen(true);
        }}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={handleDiscardDraft}
        onConfirm={handleSaveDraft}
        title={
          event === undefined ? "Save this post as draft" : "Discard draft"
        }
        content={
          event === undefined
            ? "The post you started will be here when you return."
            : "You haven’t finished your post yet. Are you sure you want to leave and discard your draft?"
        }
        cancelLabel={event === undefined ? "Discard" : "Go back"}
        confirmLabel={event === undefined ? "Save as draft" : "Discard"}
        width={event?.eventName === "" || event === undefined ? "360" : "400"}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full top-1/3 mt-16 max-w-2xl">
          <DialogTitle className="hidden">Post</DialogTitle>
          <div className="bg-white border rounded-lg p-7 relative">
            <Button
              variant="ghost"
              className="flex items-center px-4 py-10 rounded-3xl"
            >
              <Avatar>
                <AvatarImage
                  src={user?.image || undefined}
                  className="size-12"
                />
                <AvatarFallback className="bg-blue-300 text-white text-2xl">
                  {avatarFallBack}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 flex flex-col">
                <div className="font-semibold text-lg text-left">Thái Đạt</div>
                <div className="text-xs text-gray-500 flex">
                  <span>Posted to anyone</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </Button>
            <div className="relative max-h-[50vh] overflow-y-auto">
              <textarea
                className={`w-full rounded-lg text-lg  p-2 mt-4 focus:outline-none focus:border-transparent ${
                  editedImage !== null || event !== undefined ? "h-28" : "h-40"
                }`}
                placeholder="What do you want to say?"
                value={postContent}
                onChange={handleInputChange}
              />
              {(editedImage !== null || event !== undefined) && (
                <div className="flex flex-col w-full mb-4">
                  <div className="flex justify-end items-center space-x-5 mr-2">
                    {(editedImage !== null || event !== undefined) && (
                      <>
                        <Button
                          onClick={handleEditButton}
                          className="rounded-full p-3 bg-[#404040] hover:bg-black"
                        >
                          <Pencil size={18} strokeWidth={2.5} />
                        </Button>

                        <Button
                          onClick={handleDeleteButton}
                          className="rounded-full p-3  bg-[#404040] hover:bg-black"
                        >
                          <X size={18} strokeWidth={2.5} />
                        </Button>
                      </>
                    )}
                  </div>
                  {editedImage !== null && (
                    <Image
                      src={editedImage}
                      alt="image"
                      className="rounded-lg mt-4 border px-4 "
                      width={672}
                      height={200}
                    />
                  )}
                  {event !== undefined && <EventPostField event={event} />}
                </div>
              )}
            </div>
            {editedImage === null && event === undefined && (
              <>
                <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                  <Button variant="ghost" className="rounded-full w-fit">
                    <FaRegSmile className="size-6 cursor-pointer  text-gray-500 hover:text-gray-800" />
                  </Button>
                </EmojiPopover>
                <div className="flex items-center justify-start mt-7 ml-4 space-x-9 text-gray-500">
                  <Hint label="Add a media">
                    <Button
                      onClick={() => {
                        setIsOpenEditModal?.(true);
                        setOpen(false);
                        setNestedMediaModal?.(true);
                      }}
                      variant="ghost"
                      className="flex items-center space-x-4 rounded-full p-2"
                    >
                      <MdOutlinePermMedia className="size-6 cursor-pointer hover:text-gray-800" />
                    </Button>
                  </Hint>
                  <Hint label="Create an event">
                    <Button
                      onClick={handleOpenEvent}
                      variant="ghost"
                      className="flex items-center space-x-4 rounded-full p-2"
                    >
                      <MdCalendarMonth className="size-6 cursor-pointer hover:text-gray-800" />
                    </Button>
                  </Hint>
                </div>
              </>
            )}
            <div className="w-full border mt-4"></div>
            <div
              className={`flex mt-5 ${
                editedImage !== null || event !== undefined
                  ? "justify-between"
                  : "justify-end"
              }`}
            >
              {(editedImage !== null || event !== undefined) && (
                <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                  <Button variant="ghost" className="rounded-full  w-fit">
                    <FaRegSmile className="size-6 cursor-pointer  text-gray-500 hover:text-gray-800" />
                  </Button>
                </EmojiPopover>
              )}
              <Button
                type="submit"
                disabled={!postContent}
                className="bg-blue-500 text-white px-4 py-2 mr-4 rounded-full"
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default PostModal;
