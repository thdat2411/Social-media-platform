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
import { ReactPhotoEditor } from "react-photo-editor";
import PostModal from "./post-modal";
import EditorImage from "@/app/assets/editor-image.jpg";
interface ImageEditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MediaModal = ({ open, setOpen }: ImageEditModalProps) => {
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [image, setImage] = useState<File | null | undefined>();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const setFileData: React.ChangeEventHandler<HTMLInputElement> | null = (
    e
  ) => {
    if (e?.target?.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setIsPhotoEditorOpen(true);
    }
  };
  return (
    <>
      <ReactPhotoEditor
        open={isPhotoEditorOpen}
        file={image!}
        onSaveImage={() => {
          setIsPhotoEditorOpen(false);
          setOpen(false);
          setIsPostModalOpen(true);
          setImage(image);
        }}
        onClose={() => {
          setIsPhotoEditorOpen(false);
        }}
      />
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={image}
      />
      {!isPhotoEditorOpen && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full max-w-5xl">
            <div className="bg-white border rounded-lg">
              <DialogHeader className="p-6">
                <DialogTitle className="text-xl font-medium">
                  Editor
                </DialogTitle>
              </DialogHeader>
              <Separator className="p-0" />

              <div className="flex flex-col items-center  h-[700px]">
                <Image
                  src={EditorImage}
                  alt="Illustration of a person sitting at a desk with a computer and a cat lying on the floor"
                  className="mb-4 mt-8"
                  width={350}
                  height={350}
                />
                <h2 className="text-lg font-semibold mb-2">
                  Select files to begin
                </h2>
                <p className="text-gray-500 mb-4">
                  Share images or a single video in your post.
                </p>
                <label
                  htmlFor="imageUpload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Upload from computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  className="hidden"
                  multiple={false}
                  onChange={(e) => setFileData(e)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      ;
    </>
  );
};

export default MediaModal;
