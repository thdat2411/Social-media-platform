"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { useState } from "react";
import PostModal from "./post-modal";
import EditorImage from "@/app/assets/editor-image.png";
import PhotoEditor from "./photo-editor";

interface ImageEditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setDraftContent?: (draft: string | null) => void;
  setDraftImage?: (image: string | null) => void;
  nestedMediaModal?: boolean;
  setNestedMediaModal?: (open: boolean) => void;
  isIn?: boolean;
}

const MediaModal = ({
  open,
  setOpen,
  setDraftContent,
  setDraftImage,
  nestedMediaModal,
  setNestedMediaModal,
  isIn,
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
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
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
        image={uploadImage}
        setImage={setUploadImage}
      />
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={uploadImage}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        setIsOpenEditModal={setOpen}
        setNestedEventModal={setNestedMediaModal}
        isIn={isIn}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full max-w-5xl">
          <div className="bg-white border rounded-lg">
            <DialogHeader className="p-6">
              <DialogTitle className="text-xl font-medium">Editor</DialogTitle>
            </DialogHeader>
            <Separator className="p-0" />

            <div
              className={`flex flex-col items-center h-[700px] ${
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
              <h2 className="text-lg font-semibold mb-2">
                {isValid ? "Select files to begin" : "Something went wrong"}
              </h2>
              <p className="text-gray-500 mb-4">
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
