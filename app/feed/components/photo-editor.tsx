"use client";
import React from "react";
import { ReactPhotoEditor } from "react-photo-editor";
import "react-photo-editor/dist/style.css";

interface PhotoEditorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsMediaModalOpen: (open: boolean) => void;
  setIsPostModalOpen: (open: boolean) => void;
  image: File | null;
  setImage: (image: File | null) => void;

  setIsPhotoEditorOpened?: (open: boolean) => void;
}

const PhotoEditor = ({
  open,
  setOpen,
  image,
  setIsMediaModalOpen,
  setIsPostModalOpen,
  setImage,
  setIsPhotoEditorOpened,
}: PhotoEditorProps) => {
  let isChange = false;
  const handleSaveImage = (editedFile: File) => {
    isChange = true;
    setImage(editedFile);
  };

  const handleEditorClose = () => {
    if (isChange === true) {
      setOpen(false);
      setIsMediaModalOpen(false);
      setIsPhotoEditorOpened && setIsPhotoEditorOpened(false);
      setIsPostModalOpen(true);
    } else {
      setImage(null);
      setOpen(false);
      setIsMediaModalOpen(true);
      setIsPostModalOpen(false);
    }
  };
  return (
    <ReactPhotoEditor
      open={open}
      onClose={handleEditorClose}
      file={image!}
      onSaveImage={handleSaveImage}
    />
  );
};

export default PhotoEditor;
