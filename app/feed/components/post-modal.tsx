/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import EventIconHover from "@/app/assets/calendar-hover.png";
import EventIcon from "@/app/assets/calendar.png";
import PictureImageHover from "@/app/assets/picture-hover.png";
import PictureImage from "@/app/assets/picture.png";
import SmileIconHover from "@/app/assets/smile-hover.png";
import SmileIcon from "@/app/assets/smile.png";
import ConfirmModal from "@/app/components/confirm-modal";
import { defaultEvent } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { user } from "@prisma/client";
import axios from "axios";
import { set } from "lodash";
import { ChevronDown, Loader, Pencil, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { ReactPhotoEditor } from "react-photo-editor";
import { toast } from "sonner";
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
  setIsOpenEditModal?: (open: boolean) => void;
  setIsEventModalOpen?: (open: boolean) => void;
  setIsHavingText?: (value: boolean) => void;
  setTriggerReset?: (value: boolean) => void;
  setNestedMediaModal?: (value: boolean) => void;
  setNestedEventModal?: (value: boolean) => void;
  event?: Event | undefined;
  setEvent?: (event: Event | undefined) => void;
  isIn?: boolean;
  user?: user;
  isEdit?: boolean;
  setIsEdit?: (value: boolean) => void;
  post?: PostwithLiked;
  setPost?: (post: PostwithLiked) => void;
}

const PostModal = ({
  open,
  setOpen,
  image,
  setImage,
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
  setIsEdit,
  post,
  setPost,
}: PostModalProps) => {
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [postContent, setPostContent] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  const [debouncedPostContent] = useDebounce(postContent, 300);
  const avatarFallBack = user?.name.split(" ").pop()?.charAt(0).toUpperCase();
  const [isSmileHovered, setIsSmileHovered] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isEventHovered, setIsEventHovered] = useState(false);
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(
    null
  );
  const [updatedData, setUpdatedData] = useState<any>(null);

  const urlRegex = /https?:\/\/[^\s]+/g;

  useEffect(() => {
    const draftContent = sessionStorage.getItem("draftContent");
    const content = draftContent ? JSON.parse(draftContent) : null;
    const draftImage = sessionStorage.getItem("draftImage");
    const image = draftImage ? JSON.parse(draftImage) : null;
    const draftPreview = sessionStorage.getItem("draftPreview");
    const preview = draftPreview ? JSON.parse(draftPreview) : null;
    if (open === true && !isEdit) {
      setPostContent(content || "");
      setEditedImage(image || null);
    } else if (open === true && isEdit) {
      setPostContent(content ? content : post?.content || "");
      setEditedImage(image ? image : post?.image_url || null);
      setCurrentPreviewUrl(preview ? preview : post?.preview_url || null);
    }
  }, [open]);

  useEffect(() => {
    if (open === true && isEdit) {
      const draftPreview = sessionStorage.getItem("draftPreview");
      if (!editedImage) {
        if (!draftPreview && post?.preview_url) {
          fetchLinkPreview(post?.preview_url);
        } else if (draftPreview) {
          setCurrentPreviewUrl(null);
        }
      }
    }
  }, [open]);
  /*------------------------------------------------------------------*/

  const handleInputChange = (content: string) => {
    setPostContent(content);
    handleAutoResize(textareaRef.current as HTMLTextAreaElement);
    if (!editedImage) {
      const urls = content.match(urlRegex);

      if (urls && urls.length > 0) {
        if (!linkPreview && !currentPreviewUrl) {
          setCurrentPreviewUrl(urls[0]);
          fetchLinkPreview(urls[0]);
        } else {
          setLinkPreview(null);
        }
      }
    }
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

  // const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
  //   e.preventDefault();
  //   const pastedText = e.clipboardData.getData("text");
  //   const updatedContent = postContent + pastedText;
  //   handleInputChange(updatedContent); // Process the pasted content
  // };

  /*------------------------------------------------------------------*/
  const handleAutoResize = (textarea: HTMLTextAreaElement) => {
    if (textarea === null) return;
    textarea.style.height = "auto"; // Reset the height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };
  /*------------------------------------------------------------------*/
  useEffect(() => {
    if (open && image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result as string);
      };
      reader.readAsDataURL(image);
      return () => {
        reader.abort();
      };
    }
  }, [image, open]);

  /*------------------------------------------------------------------*/
  const handleSaveDraft = () => {
    if (!isEdit) {
      if (postContent?.trim() !== "") {
        sessionStorage.setItem("draftContent", JSON.stringify(postContent));
      }
      if (editedImage !== null) {
        sessionStorage.setItem("draftImage", JSON.stringify(editedImage));
      }
      setIsHavingText?.(false);
      setTriggerReset?.(true);
      setOpen(false);
      setIsConfirmModalOpen(false);
    } else {
      setIsEditConfirmModalOpen(false);
      sessionStorage.removeItem("draftContent");
      sessionStorage.removeItem("draftPreview");
      setIsEdit?.(false);
      setOpen(false);
    }
  };
  /*------------------------------------------------------------------*/
  const handleDiscardDraft = () => {
    if (!isEdit) {
      sessionStorage.removeItem("draftContent");
      sessionStorage.removeItem("draftImage");
      setPostContent("");
      setLinkPreview(null);
      setCurrentPreviewUrl(null);
      setEditedImage(null);
      setOpen(false);
      setIsConfirmModalOpen(false);
    } else {
      setIsEditConfirmModalOpen(false);
    }
  };
  /*------------------------------------------------------------------*/
  const handleClose = () => {
    console.log("isEidt", isEdit);
    if (!isEdit) {
      if (
        (postContent?.trim() !== "" ||
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
          }
          if (draftImage) {
            sessionStorage.removeItem("draftImage");
          }
        }
        setNestedEventModal?.(false);
        setNestedMediaModal?.(false);
        setOpen(false);
      }
    } else if (isEdit) {
      console.log("PostContent", postContent);
      console.log("post.conent", post?.content);
      console.log("editedImage", editedImage);
      console.log("post.image_url", post?.image_url);
      if (
        postContent !== post?.content ||
        editedImage !== post?.image_url ||
        linkPreview !== post?.preview_url
      ) {
        setIsEditConfirmModalOpen(true);
      } else {
        setNestedEventModal?.(false);
        setNestedMediaModal?.(false);
        setPost?.(post);
        setIsEdit?.(false);
        setOpen(false);
      }
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
    if (!isEdit) {
      setIsLoading(true);
      const body = {
        user_id: user?.id,
        content: postContent,
        image_url: editedImage,
        preview_url: linkPreview?.url,
      };
      axios
        .post("/api/post", body)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setOpen(false);
            sessionStorage.removeItem("draftContent");
            sessionStorage.removeItem("draftImage");
            sessionStorage.removeItem("draftPreview");
            router.refresh();
          }
        })
        .catch((error) => {
          toast.error("Failed to post");
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      const body = {
        postId: post?.id,
        content: postContent,
        image_url: editedImage,
        preview_url: linkPreview?.url,
      };
      axios
        .put("/api/post", body)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setIsEdit?.(false);
            setOpen(false);
            sessionStorage.removeItem("draftContent");
            sessionStorage.removeItem("draftImage");
            sessionStorage.removeItem("draftPreview");
            toast.success("Post updated successfully");
            router.push(`/feed/post/${post?.id}`);
            router.refresh();
          }
        })
        .catch((error) => {
          toast.error("Failed to update post");
          setIsLoading(false);
        });
    }
  };

  /*------------------------------------------------------------------*/
  if (postContent === null || (isEdit && !post)) return null;

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
        open={isEditConfirmModalOpen}
        setOpen={setIsEditConfirmModalOpen}
        onClose={handleDiscardDraft}
        onConfirm={handleSaveDraft}
        title={"Cancel updating post"}
        content={
          "You haven’t finished your post yet. Are you sure you want to cancel update?"
        }
        cancelLabel="Go back"
        confirmLabel="Cancel"
        width="400"
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
                <div className="text-left text-lg font-semibold">
                  {user?.name}
                </div>
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
                    ? "min-h-52"
                    : "min-h-72"
                }`}
                placeholder="What do you want to say?"
                value={postContent!}
                onChange={(e) => handleInputChange(e.target.value)}
                // onPaste={handlePaste}
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
                  <div className="text-sm text-muted-foreground">
                    ...Loading preview
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      className="mb-2 self-end rounded-full bg-[#404040] p-3 hover:bg-black"
                      onClick={() => {
                        setLinkPreview(null);
                        setCurrentPreviewUrl(null);
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
            {editedImage === null &&
              event === undefined &&
              !linkPreview &&
              !isPreviewLoading && (
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
                          if (postContent) {
                            sessionStorage.setItem(
                              "draftContent",
                              JSON.stringify(postContent)
                            );
                          }
                          if (!currentPreviewUrl && post?.preview_url) {
                            sessionStorage.setItem(
                              "draftPreview",
                              JSON.stringify("")
                            );
                          }
                          if (!editedImage && post?.image_url) {
                            sessionStorage.setItem(
                              "draftImage",
                              JSON.stringify("")
                            );
                          }
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
                    : (postContent === post?.content &&
                        editedImage === post?.image_url &&
                        currentPreviewUrl === post?.preview_url) ||
                      (!postContent && !editedImage && !currentPreviewUrl)
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
