import PictureImageHover from "@/app/assets/picture-hover.png";
import PictureImage from "@/app/assets/picture.png";
import SmileIconHover from "@/app/assets/smile-hover.png";
import SmileIcon from "@/app/assets/smile.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import axios from "axios";
import { SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { EmojiPopover } from "../components/emoji-popover";
import PreviewContainer from "./components/preview-container";
import { CommentsWithLiked, PostwithLiked } from "./post";

interface CommentInputProps {
  post?: PostwithLiked | null;
  setPost?: React.Dispatch<React.SetStateAction<PostwithLiked | null>>;
  comment?: CommentsWithLiked | null;
  setComment?: React.Dispatch<React.SetStateAction<CommentsWithLiked | null>>;
  setComments?: React.Dispatch<React.SetStateAction<CommentsWithLiked[]>>;
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  isReply?: boolean;
  setIsReply?: React.Dispatch<React.SetStateAction<boolean>>;
  user: user;
}

const CommentInput = ({
  post,
  comment,
  setComment,
  isEdit,
  setIsEdit,
  isReply,
  user,
}: CommentInputProps) => {
  const [data, setData] = useState<CommentsWithLiked | PostwithLiked | null>(
    comment ?? post ?? null
  );
  const [commentText, setCommentText] = useState(
    isEdit ? comment?.content : ""
  );
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSmileHovered, setIsSmileHovered] = useState(false);
  const [isEmojiFocused, setIsEmojiFocused] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputClass = `flex w-full items-center py-1 px-4 outline rounded-full text-sm  outline-gray-400 ${isFocused ? "outline-2" : "outline-1"}`;
  const textareaClass = `flex flex-col w-full py-1 px-2 outline rounded-2xl text-sm outline-gray-400  ${isFocused ? "outline-2" : "outline-1"} `;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  /*----------------------------------------------------------------*/
  const extractURL = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  /*----------------------------------------------------------------*/

  const handleEmojiSelect = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };
  /*----------------------------------------------------------------*/
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  /*----------------------------------------------------------------*/
  const removeImage = () => {
    setImageUrl("");
    setCommentText(commentText?.replace(/!\[Image\]\((.*?)\)/, ""));
  };
  /*----------------------------------------------------------------*/
  useEffect(() => {
    if (textareaRef.current && (commentText?.trim().length ?? 0) > 0) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        commentText?.length ?? 0,
        commentText?.length ?? 0
      );
    }
  }, [commentText]);
  /*----------------------------------------------------------------*/
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
  /*----------------------------------------------------------------*/
  useEffect(() => {
    if (!imageUrl) {
      if (!linkPreview && (!isEdit || (isEdit && !data?.preview_url))) {
        const urls = extractURL(commentText ?? "");
        if (urls && urls.length > 0) {
          fetchLinkPreview(urls[0]);
        } else {
          console.log("No URL detected");
        }
      } else if (isEdit && data?.preview_url) {
        if (!linkPreview) {
          fetchLinkPreview(data?.preview_url);
        }
      }
    }
  }, [commentText]);
  /*----------------------------------------------------------------*/
  useEffect(() => {
    if (commentText?.trim().length === 0 && !imageUrl && inputRef.current) {
      inputRef.current.focus();
    } else if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [commentText, imageUrl]);
  /*----------------------------------------------------------------*/
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [commentText, textareaRef]);
  /*----------------------------------------------------------------*/
  const handleInsertComment = async () => {
    try {
      setIsLoading(true);
      let cloudinaryImageUrl;
      if (imageUrl) {
        const imageData = new FormData();
        imageData.append("file", imageFile!);
        const response = await axios.post(
          "/api/cloudinary-upload?type=image",
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status !== 200) {
          console.error("Error uploading image to Cloudinary");
          return;
        } else {
          const { url } = response.data;
          cloudinaryImageUrl = url;
        }
      }
      const body = {
        user_id: currentUser?.id,
        post_id: !isReply ? data?.id : null,
        content: commentText,
        image_url: cloudinaryImageUrl ? cloudinaryImageUrl : null,
        preview_url: linkPreview ? linkPreview.url : null,
        parent_id: isReply ? data?.id : null,
      };

      axios
        .post("/api/comment", body)
        .then((response) => {
          console.log("Comment inserted:", response.data);
        })
        .catch((error) => {
          console.error("Error inserting comment:", error);
        })
        .finally(() => {
          removeImage();
          setLinkPreview(null);
          setCommentText("");
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error inserting comment:", error);
    }
  };
  /*----------------------------------------------------------------*/
  const updateComment = () => {
    try {
      setIsLoading(true);
      const body = {
        id: data?.id,
        content: commentText,
        image_url: imageUrl,
        preview_url: linkPreview?.url ? linkPreview.url : null,
      };
      axios
        .put(`/api/comment`, body)
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            const updatedComment = data.comment;
            setComment?.({
              ...comment!,
              content: updatedComment.content,
              image_url: updatedComment.image_url,
              preview_url: updatedComment.preview_url,
            });
          }
        })
        .catch((error) => {
          console.error("Error updating comment:", error);
        })
        .finally(() => {
          removeImage();
          setLinkPreview(null);
          setCommentText("");
          setIsLoading(false);
          setIsEdit?.(false);
        });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  /*----------------------------------------------------------------*/
  const renderInputField = () => (
    <div className={inputClass}>
      <input
        ref={inputRef}
        className="w-full outline-none"
        placeholder={isReply ? "Add a reply..." : "Add a comment..."}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <EmojiPopover
        onEmojiSelect={handleEmojiSelect}
        setIsEmojiFocused={setIsEmojiFocused}
      >
        <Button
          size="custom"
          className={`w-[40px] rounded-full bg-white py-2 transition-all duration-100 hover:scale-110 hover:bg-white`}
          onMouseEnter={() => setIsSmileHovered(true)}
          onMouseLeave={() => setIsSmileHovered(false)}
          onFocus={() => setIsEmojiFocused(true)}
        >
          {!isSmileHovered && !isEmojiFocused ? (
            <Image
              src={SmileIcon}
              alt=""
              className={`${isEdit ? "size-4" : "size-5"}`}
            />
          ) : (
            <Image
              src={SmileIconHover}
              className={`${isEdit ? "size-4" : "size-5"}`}
              alt=""
            />
          )}
        </Button>
      </EmojiPopover>
      <label
        htmlFor="imageUpload"
        className="group flex w-[40px] cursor-pointer justify-center rounded-full py-1"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {!isImageHovered ? (
          <Image
            src={PictureImage}
            alt="Upload"
            className={`${isEdit ? "size-4" : "size-5"}`}
          />
        ) : (
          <Image
            src={PictureImageHover}
            alt="Upload"
            className={`${isEdit ? "size-5" : "size-6"}`}
          />
        )}
      </label>
      <input
        type="file"
        accept="image/*"
        id="imageUpload"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
  /*----------------------------------------------------------------*/
  const renderTextareaField = () => (
    <div className={textareaClass}>
      <textarea
        ref={textareaRef}
        className={`w-full resize-none px-4 py-2 outline-none ${isEdit ? "text-sm" : ""}`}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
        rows={1}
        style={{ overflow: "hidden" }}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const { selectionStart, selectionEnd } =
              e.target as HTMLTextAreaElement;
            setCommentText(
              commentText?.substring(0, selectionStart) +
                "\n" +
                commentText?.substring(selectionEnd)
            );
            setTimeout(() => {
              textareaRef.current!.selectionStart =
                textareaRef.current!.selectionEnd = selectionStart + 1;
            }, 0);
            e.preventDefault();
          } else if (e.key === "Escape") {
            setIsEdit?.(false);
          }
        }}
      />
      {imageUrl && (
        <div className="relative mt-2 flex items-center px-4">
          <Image
            src={imageUrl}
            alt="Selected"
            className="mr-2 aspect-auto rounded-lg object-cover"
            width={100}
            height={100}
          />
          <Button
            onClick={removeImage}
            className="absolute left-24 top-2 w-fit rounded-full bg-black p-3 hover:bg-black"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {linkPreview && (
        <div className="mt-2 px-4 py-2">
          {isPreviewLoading ? (
            <p className="text-xs">Loading preview...</p>
          ) : (
            <PreviewContainer
              data={linkPreview}
              isComment={true}
              {...(isEdit
                ? {
                    setEditData: setData as React.Dispatch<
                      React.SetStateAction<CommentsWithLiked | null>
                    >,
                  }
                : {})}
              setLinkPreview={setLinkPreview}
            />
          )}
        </div>
      )}
      <div className="mb-5 mt-3 flex h-[30px] justify-between px-2">
        <div className="flex items-center space-x-2">
          <EmojiPopover
            onEmojiSelect={handleEmojiSelect}
            setIsEmojiFocused={setIsEmojiFocused}
          >
            <Button
              size="custom"
              className={`w-[30px] rounded-full bg-white py-2 transition-all duration-100 hover:scale-110 hover:bg-white`}
              onMouseEnter={() => setIsSmileHovered(true)}
              onMouseLeave={() => setIsSmileHovered(false)}
              onFocus={() => setIsEmojiFocused(true)}
            >
              {!isSmileHovered && !isEmojiFocused ? (
                <Image
                  src={SmileIcon}
                  alt=""
                  className={`${isEdit ? "size-4" : "size-5"}`}
                />
              ) : (
                <Image
                  src={SmileIconHover}
                  className={`${isEdit ? "size-5" : "size-6"}`}
                  alt=""
                />
              )}
            </Button>
          </EmojiPopover>
          {!imageUrl && !linkPreview && renderImageUpload()}
        </div>
        {!isEdit && !isReply ? (
          <Button
            variant="ghost"
            type="submit"
            className="rounded-full p-3"
            onClick={handleInsertComment}
            disabled={isLoading}
          >
            <SendHorizontal className="size-5" />
          </Button>
        ) : !isReply ? (
          <div className="flex space-x-2">
            <Button
              className="h-6 cursor-pointer rounded-full bg-slate-500 px-2 py-1 text-xs text-white hover:bg-slate-700 hover:text-white"
              disabled={
                commentText === data?.content || commentText?.length === 0
              }
              onClick={updateComment}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  updateComment();
                }
              }}
            >
              Save changes
            </Button>
            <Button
              onClick={() => setIsEdit?.(false)}
              className="h-6 rounded-full px-2 py-1 text-xs outline outline-1 outline-gray-400 hover:outline-2"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            type="submit"
            className="h-6 cursor-pointer rounded-full bg-slate-500 px-2 py-1 text-sm text-white hover:bg-slate-700 hover:text-white"
            onClick={handleInsertComment}
            disabled={isLoading}
          >
            Reply
          </Button>
        )}
      </div>
    </div>
  );
  /*----------------------------------------------------------------*/
  const renderImageUpload = () => (
    <>
      <label
        htmlFor="imageUpload"
        className="group cursor-pointer rounded-full p-0 transition-all duration-100 hover:scale-110"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {!isImageHovered ? (
          <Image
            src={PictureImage}
            alt="Upload"
            className={`${isEdit ? "size-4" : "size-5"}`}
          />
        ) : (
          <Image
            src={PictureImageHover}
            alt="Upload"
            className={`${isEdit ? "size-5" : "size-6"}`}
          />
        )}
      </label>
      <input
        type="file"
        disabled={isLoading}
        accept="image/*"
        id="imageUpload"
        className="hidden"
        onChange={handleImageUpload}
      />
    </>
  );
  /*----------------------------------------------------------------*/
  return (
    <div
      className={`mt-4 flex space-x-2 ${commentText?.trim().length === 0 && !imageUrl && !linkPreview ? "items-center" : "items-start"}`}
    >
      {!isEdit && (
        <Avatar className="size-10">
          <AvatarImage
            src={currentUser?.image ?? ""}
            className="rounded-full"
          />
          <AvatarFallback className="flex size-10 items-center justify-center bg-blue-300 text-lg font-medium text-white">
            {currentUser?.name.split(" ").pop()?.charAt(0).toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      )}
      {commentText?.trim().length === 0 && !imageUrl && !linkPreview
        ? renderInputField()
        : renderTextareaField()}
    </div>
  );
};

export default CommentInput;
