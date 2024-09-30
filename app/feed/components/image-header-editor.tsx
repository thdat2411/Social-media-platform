import ConfirmModal from "@/app/components/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
interface ImageHeaderEditorProps {
  openImageEditor: boolean;
  setImageEditorOpen: (open: boolean) => void;
  image: string | undefined;
  setImage: (image: string) => void;
  setIsEventModalOpen?: (open: boolean) => void;
  isHavingText?: boolean;
  setIsHavingText?: (value: boolean) => void;
  setTriggerReset?: (value: boolean) => void;
}

const ImageHeaderEditor = ({
  openImageEditor,
  setImageEditorOpen,
  image,
  setImage,
  setIsEventModalOpen,
  isHavingText,
  setIsHavingText,
  setTriggerReset,
}: ImageHeaderEditorProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = React.useRef<HTMLImageElement>(null);

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  useEffect(() => {
    if (image) {
      setImgSrc(image);
    }
  }, [image]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      const newCrop = centerAspectCrop(width, height, aspect);
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  };

  const handleToggleAspectClick = () => {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  };
  const handleClose = () => {
    if (isHavingText) {
      setIsConfirmModalOpen(true);
    } else {
      setImageEditorOpen(false);
      setImgSrc("");
      setImage("");
      setCrop(undefined);
      setAspect(16 / 9);
      setIsEventModalOpen?.(false);
    }
  };
  const handleReturn = () => {
    setImageEditorOpen(false);
    setImgSrc("");
    setImage("");
    setCrop(undefined);
    setAspect(16 / 9);
    setIsEventModalOpen?.(true);
  };
  const onClose = () => {
    setIsHavingText?.(false);
    setTriggerReset?.(true);
    setIsConfirmModalOpen(false);
    setImageEditorOpen(false);
    setImgSrc("");
    setImage("");
    setCrop(undefined);
    setAspect(16 / 9);
  };

  const getCroppedImg = async () => {
    if (completedCrop && imgRef.current) {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      const pixelCrop = completedCrop;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImgUrl = URL.createObjectURL(blob);
            resolve(croppedImgUrl);
          } else {
            resolve("");
          }
        }, "image/jpeg");
      });
    }
    return "";
  };

  return (
    <>
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={onClose}
        title="Discard changes"
        content="Are you sure you want to discard the changes you have made?"
        cancelLabel="Cancel"
        confirmLabel="Discard"
        width={"350"}
      />
      <Dialog open={openImageEditor} onOpenChange={handleClose}>
        <DialogContent className="p-0 bg-gray-50 w-full max-w-xl">
          <DialogHeader className="flex p-7 justify-between">
            <div className="flex space-x-4 text-lg items-center">
              <Button
                onClick={handleReturn}
                variant="ghost"
                className="rounded-full p-3 hover:bg-slate-300"
              >
                <MoveLeft className="size-5" />
              </Button>
              <p>Edit cover photo</p>
            </div>
          </DialogHeader>
          <div className="flex flex-col w-full px-7 pb-7 space-y-7">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              // minWidth={400}
              maxHeight={400}
              // circularCrop
            >
              <Image
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                width={600}
                height={400}
              />
            </ReactCrop>
            <div className="flex w-full justify-end">
              <Button
                onClick={handleToggleAspectClick}
                variant="outline"
                className="rounded-full border-2 border-gray-500 hover:border-black items-center w-fit"
              >
                Toogle
              </Button>
            </div>
          </div>
          <DialogFooter className="p-6">
            <label
              htmlFor="changeImage"
              className="flex items-center rounded-full border-2 px-4 cursor-pointer border-gray-500 hover:border-2 hover:border-black mr-4"
            >
              <p className="text-sm">Change photo</p>
            </label>
            <input
              type="file"
              accept="image/*"
              id="changeImage"
              className="hidden"
              multiple={false}
              onChange={onSelectFile}
            />
            <Button
              onClick={async () => {
                const croppedImage = await getCroppedImg();
                setImage(croppedImage);
                setImageEditorOpen(false);
                setIsEventModalOpen?.(true);
              }}
              className="rounded-full bg-blue-500 hover:bg-blue-800"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageHeaderEditor;
