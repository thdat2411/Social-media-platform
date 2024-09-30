"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, X } from "lucide-react";
import { FaRegSmile } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Hint } from "../../components/hint";
import { MdCalendarMonth, MdOutlinePermMedia } from "react-icons/md";
import { EmojiPopover } from "../../components/emoji-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactPhotoEditor } from "react-photo-editor";
import ConfirmModal from "../../components/confirm-modal";
import { useDebounce } from "use-debounce";

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: File | null | undefined;
  draftImage?: string | null;
  draftContent?: string | null;
  setDraftContent: (draft: string | null) => void;
  setDraftImage: (image: string | null) => void;
  setIsOpenEditModal?: (open: boolean) => void;
}

const PostModal = ({
  open,
  setOpen,
  image,
  draftContent,
  draftImage,
  setDraftContent,
  setDraftImage,
  setIsOpenEditModal,
}: PostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
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
      setDraftContent(debouncedPostContent);
    }
    if (draftImage) {
      setEditedImage(draftImage);
    }
  }, [draftContent, draftImage, debouncedPostContent, setDraftContent]);

  useEffect(() => {
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
  }, [image]);

  const handleSaveDraft = () => {
    if (postContent.trim() !== "") {
      setDraftContent(postContent);
      localStorage.setItem("draftContent", JSON.stringify(postContent));
    }
    if (editedImage !== null) {
      setDraftImage(editedImage);
      localStorage.setItem("draftImage", JSON.stringify(editedImage));
    }
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("draftContent");
    localStorage.removeItem("draftImage");
    setDraftContent(null);
    setDraftImage(null);
    setPostContent("");
    setEditedImage(null);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleClose = () => {
    if (postContent.trim() !== "" || editedImage) {
      setIsConfirmModalOpen(true);
    } else {
      const draftContent = localStorage.getItem("draftContent");
      const draftImage = localStorage.getItem("draftImage");
      if (draftContent || draftImage) {
        if (draftContent) {
          localStorage.removeItem("draftContent");
          setDraftContent(null);
        }
        if (draftImage) {
          localStorage.removeItem("draftImage");
          setDraftImage(null);
        }
      }
      setOpen(false);
    }
  };

  const handleSaveImage = (editedFile: File) => {
    setEditedImage(URL.createObjectURL(editedFile));
    setIsPhotoEditorOpen(false);
    setOpen(true);
  };
  return (
    <>
      <ReactPhotoEditor
        open={isPhotoEditorOpen}
        file={image!}
        onSaveImage={handleSaveImage}
        onClose={() => {
          setIsPhotoEditorOpen(false);
        }}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={handleDiscardDraft}
        onConfirm={handleSaveDraft}
        title="Save this post as draft"
        content="The post you started will be here when you return."
        cancelLabel="Discard"
        confirmLabel="Save as draft"
        width="360"
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full top-1/3 mt-16 max-w-2xl">
          <div className="bg-white border rounded-lg p-7 relative">
            <Button
              variant="ghost"
              className="flex items-center px-4 py-10 rounded-3xl"
            >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="size-12"
                />
                <AvatarFallback>CN</AvatarFallback>
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
                  image ? "h-28" : "h-60"
                }`}
                placeholder="What do you want to say?"
                value={postContent}
                onChange={handleInputChange}
              />
              {editedImage && (
                <div className="flex flex-col w-full mb-4">
                  <div className="flex justify-end items-center space-x-5 mr-2">
                    <Button
                      onClick={() => {
                        setIsPhotoEditorOpen(true);
                        setOpen(false);
                      }}
                      className="rounded-full p-3 bg-[#404040] hover:bg-black"
                    >
                      <Pencil size={18} strokeWidth={2.5} />
                    </Button>
                    <Button
                      onClick={() => {
                        setEditedImage(null);
                      }}
                      className="rounded-full p-3  bg-[#404040] hover:bg-black"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </Button>
                  </div>
                  <Image
                    src={editedImage!}
                    alt="image"
                    className="rounded-lg mt-4 border px-4 "
                    width={672}
                    height={200}
                  />
                </div>
              )}
            </div>
            {!editedImage && (
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
                      }}
                      variant="ghost"
                      className="flex items-center space-x-4 rounded-full p-2"
                    >
                      <MdOutlinePermMedia className="size-6 cursor-pointer hover:text-gray-800" />
                    </Button>
                  </Hint>
                  <Hint label="Create an event">
                    <div className="flex items-center space-x-4">
                      <MdCalendarMonth className="size-6 cursor-pointer hover:text-gray-800" />
                    </div>
                  </Hint>
                  <Hint label="Add a document">
                    <div className="flex items-center space-x-4">
                      <IoDocumentText className="size-6 cursor-pointer hover:text-gray-800" />
                    </div>
                  </Hint>
                </div>
              </>
            )}
            <div className="w-full border mt-4"></div>
            <div
              className={`flex mt-5 ${
                editedImage ? "justify-between" : "justify-end"
              }`}
            >
              {editedImage && (
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
