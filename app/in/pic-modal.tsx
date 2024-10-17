import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

interface PictureModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string | null;
}

const PictureModal = ({ open, setOpen, image }: PictureModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white">
        <Image src={image!} alt="user-avatar" width={400} height={400} />
      </DialogContent>
    </Dialog>
  );
};

export default PictureModal;
