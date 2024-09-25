import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface ConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

const ConfirmModal = ({
  open,
  setOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden top-1/4 mt-16 h-fit w-[340px]">
        <div className="bg-white border rounded-lg">
          <DialogHeader className="pt-7 px-3 pb-2">
            <DialogTitle className="text-lg font-medium">
              Save this post as a draft
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <p className="pt-2 px-3 pb-6">
            The post you started will be here when you return
          </p>
          <Separator />
          <div className="flex justify-end items-center space-x-3 py-4 mr-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-2 border-blue-600 rounded-full text-blue-600 hover:border-blue-900 hover:text-blue-600"
            >
              Discard
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-800 rounded-full"
            >
              Save as draft
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
