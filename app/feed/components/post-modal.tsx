/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import EventIconHover from "@/app/assets/calendar-hover.png";
import EventIcon from "@/app/assets/calendar.png";
import PictureImageHover from "@/app/assets/picture-hover.png";
import PictureImage from "@/app/assets/picture.png";
import SmileIconHover from "@/app/assets/smile-hover.png";
import SmileIcon from "@/app/assets/smile.png";
import { defaultEvent } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { user } from "@prisma/client";
import axios from "axios";
import { ChevronDown, Loader, Pencil, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { ReactPhotoEditor } from "react-photo-editor";
import { text } from "stream/consumers";
import { useDebounce } from "use-debounce";
import { EmojiPopover } from "../../components/emoji-popover";
import { Hint } from "../../components/hint";
import { PostwithLiked } from "../post";
import {
  default as Event,
  default as EventPostField,
} from "./event-post-field";
import PreviewContainer from "./preview-container";

const ConfirmModal = dynamic(() => import("../../components/confirm-modal"));
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
  isEdit?: boolean;
  post?: PostwithLiked;
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
  isEdit,
  post,
}: PostModalProps) => {
  console.log(isEdit);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState(
    isEdit && post ? post.content : ""
  );
  const [editedImage, setEditedImage] = useState<string | null>(
    isEdit && post ? post.image_url : null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [debouncedPostContent] = useDebounce(postContent, 300);
  const avatarFallBack = user?.name.split(" ").pop()?.charAt(0).toUpperCase();
  const [isSmileHovered, setIsSmileHovered] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isEventHovered, setIsEventHovered] = useState(false);
  const [linkPreview, setLinkPreview] = useState<any>(
    isEdit && post ? post.preview_url : null
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /*------------------------------------------------------------------*/
  const extractURL = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
  };

  /*------------------------------------------------------------------*/
  const fetchLinkPreview = async (url: string) => {
    try {
      setIsPreviewLoading(true);
      if (url.includes(window.location.origin)) {
        const jobId = url.split("/").pop();
        const response = await axios.get(`/api/jobs/view/${jobId}`);
        const { jobPost } = response.data;
        setLinkPreview({ ...jobPost, url });
      } else {
        const response = await axios.get(`/api/fetchLinkPreview?url=${url}`);
        const { preview } = response.data;
        setLinkPreview(preview);
      }
      setIsPreviewLoading(false);
    } catch (error) {
      console.error("Error fetching link preview:", error);
      setLinkPreview(null); // Reset if there's an error
    }
  };

  /*------------------------------------------------------------------*/
  useEffect(() => {
    if (!linkPreview) {
      const urls = extractURL(postContent);
      if (urls && urls.length > 0) {
        fetchLinkPreview(urls[0]);
      } else {
        console.log("No URL detected");
      }
    }
  }, [postContent]);
  /*------------------------------------------------------------------*/
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
    handleAutoResize(e.target);
  };

  const handleAutoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto"; // Reset the height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };
  /*------------------------------------------------------------------*/
  useEffect(() => {
    if (draftContent) {
      setDraftContent?.(debouncedPostContent);
    }
    if (draftImage) {
      setEditedImage(draftImage);
    }
  }, [draftContent, draftImage, debouncedPostContent, setDraftContent]);
  /*------------------------------------------------------------------*/
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
  }, [image, open]);

  /*------------------------------------------------------------------*/
  const handleSaveDraft = () => {
    if (postContent.trim() !== "") {
      setDraftContent?.(postContent);
      sessionStorage.setItem("draftContent", JSON.stringify(postContent));
    }
    if (editedImage !== null) {
      setDraftImage?.(editedImage);
      sessionStorage.setItem("draftImage", JSON.stringify(editedImage));
    }
    setIsHavingText?.(false);
    setTriggerReset?.(true);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };
  /*------------------------------------------------------------------*/
  const handleDiscardDraft = () => {
    sessionStorage.removeItem("draftContent");
    sessionStorage.removeItem("draftImage");
    setDraftContent?.(null);
    setDraftImage?.(null);
    setPostContent("");
    setLinkPreview(null);
    setEditedImage(null);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };
  /*------------------------------------------------------------------*/
  const handleClose = () => {
    if (
      (postContent.trim() !== "" ||
        editedImage !== null ||
        event !== undefined ||
        linkPreview) &&
      isIn === false
    ) {
      setIsConfirmModalOpen(true);
    } else {
      const draftContent = sessionStorage.getItem("draftContent");
      const draftImage = sessionStorage.getItem("draftImage");
      if (draftContent || draftImage) {
        if (draftContent) {
          sessionStorage.removeItem("draftContent");
          setDraftContent?.(null);
        }
        if (draftImage) {
          sessionStorage.removeItem("draftImage");
          setDraftImage?.(null);
        }
      }
      setNestedEventModal?.(false);
      setNestedMediaModal?.(false);
      setOpen(false);
    }
  };
  /*------------------------------------------------------------------*/
  const handleSaveImage = (editedFile: File) => {
    setEditedImage(URL.createObjectURL(editedFile));
  };
  /*------------------------------------------------------------------*/
  const handleEditButton = async () => {
    if (editedImage !== null) {
      const fileName = "draft-image.jpg";
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const draftImageFile = new File([blob], fileName, {
        type: blob.type,
      });
      setImage?.(draftImageFile);
      setIsPhotoEditorOpen(true);
    } else if (event !== undefined) {
      setIsEventModalOpen?.(true);
    }
    setOpen(false);
  };
  /*------------------------------------------------------------------*/
  const handleOpenEvent = () => {
    setIsEventModalOpen?.(true);
    setEvent?.(defaultEvent);

    setOpen(false);
    setNestedEventModal?.(true);
  };
  /*------------------------------------------------------------------*/
  const handleDeleteButton = () => {
    if (event !== undefined) {
      setEvent?.(undefined);
    }
    if (editedImage !== null) {
      setEditedImage(null);
    }
  };
  /*------------------------------------------------------------------*/
  const handlePost = () => {
    setIsLoading(true);
    const body = {
      user_id: user.id,
      content: postContent,
      image_url: editedImage,
      preview_url: linkPreview?.url,
    };
    axios.post("/api/post", body).then((response) => {
      if (response.status === 200) {
        setIsLoading(false);
        setOpen(false);
        router.refresh();
      }
    });
  };
  /*------------------------------------------------------------------*/

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
        <DialogContent
          className={`top-[35%] mt-16 w-full max-w-3xl overflow-hidden bg-gray-50 p-0 ${editedImage || linkPreview ? "h-[80%]" : ""}`}
        >
          <DialogTitle className="hidden">Post</DialogTitle>
          <div className="relative rounded-lg border bg-white p-7">
            {isLoading && (
              <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
                <div className="flex flex-col items-center">
                  <Loader className="size-10 animate-spin" />
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="flex items-center rounded-3xl px-4 py-10"
            >
              <Avatar className="size-12">
                <AvatarImage
                  src={user?.image || undefined}
                  className="size-12"
                />
                <AvatarFallback className="bg-blue-300 text-2xl text-white">
                  {avatarFallBack}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 flex flex-col">
                <div className="text-left text-lg font-semibold">Thái Đạt</div>
                <div className="flex text-xs text-gray-500">
                  <span>Posted to anyone</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </Button>
            <div
              className={`relative overflow-y-auto ${
                editedImage || linkPreview ? "h-[58vh]" : "h-[40vh]"
              }`}
            >
              <textarea
                ref={textareaRef}
                className={`mt-4 w-full rounded-lg p-2 text-base font-normal focus:border-transparent focus:outline-none ${
                  editedImage !== null || event !== undefined || linkPreview
                    ? "min-h-40"
                    : "min-h-72"
                }`}
                placeholder="What do you want to say?"
                value={postContent}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const { selectionStart, selectionEnd } =
                      e.target as HTMLTextAreaElement;
                    setPostContent(
                      postContent?.substring(0, selectionStart) +
                        "\n" +
                        postContent?.substring(selectionEnd)
                    );
                    e.preventDefault();
                  }
                }}
              />

              {linkPreview &&
                (isPreviewLoading ? (
                  <div>...Loading preview</div>
                ) : (
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="mb-2 self-end rounded-full bg-[#404040] p-3 hover:bg-black"
                      onClick={() => {
                        setLinkPreview(null);
                      }}
                    >
                      <X size={18} strokeWidth={2.5} color="white" />
                    </Button>
                    <PreviewContainer data={linkPreview} isComment={false} />
                  </div>
                ))}

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
                      className="mt-4 w-full px-4"
                      width={672}
                      height={200}
                    />
                  )}
                  {event !== undefined && <EventPostField event={event} />}
                </div>
              )}
            </div>
            {editedImage === null && event === undefined && !linkPreview && (
              <>
                <EmojiPopover
                  onEmojiSelect={handleEmojiSelect}
                  setIsEmojiFocused={setIsEmojiFocused}
                >
                  <Button
                    variant="ghost"
                    className="w-fit rounded-full transition-all duration-100 hover:scale-110"
                    onMouseEnter={() => setIsSmileHovered(true)}
                    onMouseLeave={() => setIsSmileHovered(false)}
                    onFocus={() => setIsEmojiFocused(true)}
                  >
                    {!isSmileHovered && !isEmojiFocused ? (
                      <Image src={SmileIcon} alt="" className="size-5" />
                    ) : (
                      <Image src={SmileIconHover} className="size-6" alt="" />
                    )}
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
                      className="flex items-center space-x-4 rounded-full p-3 transition-all duration-100 hover:scale-110"
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}
                    >
                      {!isImageHovered ? (
                        <Image
                          src={PictureImage}
                          alt="Upload"
                          className="size-6"
                        />
                      ) : (
                        <Image
                          src={PictureImageHover}
                          alt="Upload"
                          className="size-7"
                        />
                      )}
                    </Button>
                  </Hint>
                  <Hint label="Create an event">
                    <Button
                      onClick={handleOpenEvent}
                      variant="ghost"
                      className="flex items-center space-x-4 rounded-full p-3 transition-all duration-100 hover:scale-110"
                      onMouseEnter={() => setIsEventHovered(true)}
                      onMouseLeave={() => setIsEventHovered(false)}
                    >
                      {!isEventHovered ? (
                        <Image
                          src={EventIcon}
                          alt="Upload"
                          className="size-5"
                        />
                      ) : (
                        <Image
                          src={EventIconHover}
                          alt="Upload"
                          className="size-6"
                        />
                      )}
                    </Button>
                  </Hint>
                </div>
              </>
            )}

            <div className="mt-4 w-full border"></div>
            <div
              className={`mt-5 flex ${
                editedImage !== null || event !== undefined || linkPreview
                  ? "justify-between"
                  : "justify-end"
              }`}
            >
              {(editedImage !== null || event !== undefined || linkPreview) && (
                <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                  <Button variant="ghost" className="w-fit rounded-full">
                    <FaRegSmile className="size-6 cursor-pointer text-gray-500 hover:text-gray-800" />
                  </Button>
                </EmojiPopover>
              )}
              <Button
                type="submit"
                disabled={
                  !isEdit
                    ? !postContent || isLoading
                    : postContent === post?.content &&
                      editedImage === post?.image_url &&
                      linkPreview === post?.preview_url
                }
                className="mr-4 rounded-full bg-blue-500 px-4 py-2 text-lg text-white"
                onClick={handlePost}
              >
                {isEdit ? "Save" : "Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default PostModal;
