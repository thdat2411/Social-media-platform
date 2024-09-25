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
import ConfirmModal from "./confirm-modal";

interface PostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: File | null | undefined;
  draft?: string | null;
  updateDraft?: (draft: string) => void;
}

const PostModal = ({
  open,
  setOpen,
  image,
  draft,
  updateDraft,
}: PostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
  };

  useEffect(() => {
    if (draft) {
      setPostContent(draft);
    }
  }, [draft]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleSaveDraft = () => {
    updateDraft?.(postContent);
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("draft");
    updateDraft?.("");
    setPostContent("");
    setOpen(false);
    setIsConfirmModalOpen(false);
  };

  const handleCloseWithText = () => {
    if (postContent.trim() !== "" || editedImage) {
      setIsConfirmModalOpen(true);
    } else {
      localStorage.removeItem("draft");
      updateDraft!("");
      setOpen(false);
    }
  };
  return (
    <>
      <ReactPhotoEditor
        open={isPhotoEditorOpen}
        file={image!}
        onSaveImage={() => {
          setIsPhotoEditorOpen(false);
          setOpen(true);
        }}
        onClose={() => {
          setIsPhotoEditorOpen(false);
        }}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={handleDiscardDraft}
        onConfirm={handleSaveDraft}
      />
      <Dialog
        open={open}
        onOpenChange={() => (open ? handleCloseWithText() : setOpen(false))}
      >
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
                    <div className="flex items-center space-x-4">
                      <MdOutlinePermMedia className="size-6 cursor-pointer hover:text-gray-800" />
                    </div>
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
              {image && (
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
