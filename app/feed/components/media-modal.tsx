"use client";
import EditorImage from "@/app/assets/editor-image.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { PostwithLiked } from "../post";
import PhotoEditor from "./photo-editor";
import PostModal from "./post-modal";

interface ImageEditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nestedMediaModal?: boolean;
  setNestedMediaModal?: (open: boolean) => void;
  setIsPhotoEditorOpened?: (open: boolean) => void;
  isIn?: boolean;
  user: user;
  post?: PostwithLiked;
  setPost?: (post: PostwithLiked) => void;
  isEdit?: boolean;
  setIsEdit?: (edit: boolean) => void;
}

const MediaModal = ({
  open,
  setOpen,
  nestedMediaModal,
  setNestedMediaModal,
  setIsPhotoEditorOpened,
  isIn,
  user,
  post,
  setPost,
  isEdit,
  setIsEdit,
}: ImageEditModalProps) => {
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFileType(file)) {
        setUploadImage(file);
        setIsPhotoEditorOpen(true);
        setIsPhotoEditorOpened?.(true);
        setOpen(false);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  const handleClose = () => {
    if (nestedMediaModal) {
      setUploadImage(null);
      setIsPostModalOpen(true);
    }
    setOpen(false);
  };

  const validateFileType = (file: File) => file.type.startsWith("image/");

  const renderFileInput = () => (
    <>
      <label
        htmlFor="imageUpload"
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {isValid ? "Upload from computer" : "Try again"}
      </label>
      <input
        type="file"
        accept="image/*"
        id="imageUpload"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );

  return (
    <>
      <PhotoEditor
        open={isPhotoEditorOpen}
        setOpen={setIsPhotoEditorOpen}
        setIsMediaModalOpen={setOpen}
        setIsPostModalOpen={setIsPostModalOpen}
        setIsPhotoEditorOpened={setIsPhotoEditorOpened}
        image={uploadImage}
        setImage={setUploadImage}
      />
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={uploadImage}
        setIsOpenEditModal={setOpen}
        setNestedEventModal={setNestedMediaModal}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isIn={isIn}
        user={user}
        post={post}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-5xl overflow-hidden bg-gray-50 p-0">
          <div className="rounded-lg border bg-white">
            <DialogHeader className="p-6">
              <DialogTitle className="text-xl font-medium">Editor</DialogTitle>
            </DialogHeader>
            <Separator className="p-0" />

            <div
              className={`flex h-[700px] flex-col items-center ${
                isValid ? "bg-white" : "bg-red-300"
              }`}
            >
              <Image
                src={EditorImage}
                alt=""
                className="mb-4 mt-8"
                width={350}
                height={350}
              />
              <h2 className="mb-2 text-lg font-semibold">
                {isValid ? "Select files to begin" : "Something went wrong"}
              </h2>
              <p className="mb-4 text-gray-500">
                {isValid
                  ? "Share images or a single video in your post."
                  : "File(s) not supported. Upload a supported content type."}
              </p>
              {renderFileInput()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaModal;
