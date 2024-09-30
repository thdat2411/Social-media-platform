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
  width: string;
  title: string;
  content: string;
  cancelLabel: string;
  confirmLabel: string;
}

const ConfirmModal = ({
  open,
  setOpen,
  onClose,
  onConfirm,
  title,
  content,
  cancelLabel,
  confirmLabel,
  width,
}: ConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 bg-gray-50 overflow-hidden top-1/4 mt-16 h-fit "
        style={{ width: `${width}px` }}
      >
        <div className="bg-white border rounded-lg">
          <DialogHeader className="pt-7 px-3 pb-2">
            <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          </DialogHeader>
          <Separator />
          <p className="pt-2 px-3 pb-6">{content}</p>
          <Separator />
          <div className="flex justify-end items-center space-x-3 py-4 mr-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-2 border-blue-600 rounded-full text-blue-600 hover:border-blue-900 hover:text-blue-600"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-800 rounded-full"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
