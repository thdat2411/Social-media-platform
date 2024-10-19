"use client";
import { defaultEvent } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, Pencil, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { MdCalendarMonth, MdOutlinePermMedia } from "react-icons/md";
import { ReactPhotoEditor } from "react-photo-editor";
import { useDebounce } from "use-debounce";
import ConfirmModal from "../../components/confirm-modal";
import { EmojiPopover } from "../../components/emoji-popover";
import { Hint } from "../../components/hint";
import {
  default as Event,
  default as EventPostField,
} from "./event-post-field";
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
}: PostModalProps) => {
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [debouncedPostContent] = useDebounce(postContent, 300);

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
        <DialogContent className="top-1/3 mt-16 w-full max-w-2xl overflow-hidden bg-gray-50 p-0">
          <DialogTitle className="hidden">Post</DialogTitle>
          <div className="relative rounded-lg border bg-white p-7">
            <Button
              variant="ghost"
              className="flex items-center rounded-3xl px-4 py-10"
            >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="size-12"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="ml-2 flex flex-col">
                <div className="text-left text-lg font-semibold">Thái Đạt</div>
                <div className="flex text-xs text-gray-500">
                  <span>Posted to anyone</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </Button>
            <div className="relative max-h-[50vh] overflow-y-auto">
              <textarea
                className={`mt-4 w-full rounded-lg p-2 text-lg focus:border-transparent focus:outline-none ${
                  editedImage !== null || event !== undefined ? "h-28" : "h-40"
                }`}
                placeholder="What do you want to say?"
                value={postContent}
                onChange={handleInputChange}
              />
              {(editedImage !== null || event !== undefined) && (
                <div className="mb-4 flex w-full flex-col">
                  <div className="mr-2 flex items-center justify-end space-x-5">
                    {(editedImage !== null || event !== undefined) && (
                      <>
                        <Button
                          onClick={handleEditButton}
                          className="rounded-full bg-[#404040] p-3 hover:bg-black"
                        >
                          <Pencil size={18} strokeWidth={2.5} />
                        </Button>

                        <Button
                          onClick={handleDeleteButton}
                          className="rounded-full bg-[#404040] p-3 hover:bg-black"
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
                      className="mt-4 rounded-lg border px-4"
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
                  <Button variant="ghost" className="w-fit rounded-full">
                    <FaRegSmile className="size-6 cursor-pointer text-gray-500 hover:text-gray-800" />
                  </Button>
                </EmojiPopover>
                <div className="ml-4 mt-7 flex items-center justify-start space-x-9 text-gray-500">
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
            <div className="mt-4 w-full border"></div>
            <div
              className={`mt-5 flex ${
                editedImage !== null || event !== undefined
                  ? "justify-between"
                  : "justify-end"
              }`}
            >
              {(editedImage !== null || event !== undefined) && (
                <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                  <Button variant="ghost" className="w-fit rounded-full">
                    <FaRegSmile className="size-6 cursor-pointer text-gray-500 hover:text-gray-800" />
                  </Button>
                </EmojiPopover>
              )}
              <Button
                type="submit"
                disabled={!postContent}
                className="mr-4 rounded-full bg-blue-500 px-4 py-2 text-white"
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
