"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Croppie from "croppie";
import "croppie/croppie.css";
import { Button } from "@/components/ui/button";

interface CroppieModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string | null;
  setImage: (image: string | null) => void;
  isAvatarImage?: boolean;
}

const CroppieModal = ({
  open,
  setOpen,
  image,
  setImage,
  isAvatarImage,
}: CroppieModalProps) => {
  const croppieRef = useRef<HTMLDivElement | null>(null);
  const [croppieInstance, setCroppieInstance] = useState<Croppie | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    const options = {
      showZoomer: true,
      enableOrientation: true,
      mouseWheelZoom: true,
      viewport: {
        width: isAvatarImage ? 180 : 400,
        height: 180,
        type: isAvatarImage ? ("circle" as const) : ("square" as const),
      },
      boundary: {
        width: 400,
        height: 400,
      },
    };
    if (open && croppieRef.current && !croppieInstance) {
      const instance = new Croppie(croppieRef.current, options);
      setCroppieInstance(instance);
      if (image) {
        instance.bind({ url: image }).catch((err) => {
          console.error("Error binding image:", err);
        });
      }
    }
    return () => {
      if (croppieInstance) {
        setCroppieInstance(null);
      }
    };
  }, [open, image, croppieInstance]);

  const handleCrop = () => {
    if (croppieInstance) {
      croppieInstance.result({ type: "base64" }).then((base64) => {
        setCroppedImage(base64);
      });
    }
  };

  const onClose = () => {
    setOpen(false);
    setCroppedImage(null);
    setImage(null);
    if (croppieInstance) {
      setCroppieInstance(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden w-full max-w-5xl">
        <div className="bg-white border rounded-lg">
          <DialogHeader className="p-6">
            <DialogTitle className="text-xl font-medium">Editor</DialogTitle>
          </DialogHeader>
          <Separator className="p-0" />
          <div className="p-6">
            <div ref={croppieRef}></div>
          </div>
          <Separator className="p-0" />
          <div className="flex justify-end items-center p-4">
            <Button
              className=" bg-blue-500 text-white rounded"
              onClick={handleCrop}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CroppieModal;
