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
        className="top-1/4 mt-16 h-fit overflow-hidden bg-gray-50 p-0"
        style={{ width: `${width}px` }}
      >
        <div className="rounded-lg border bg-white">
          <DialogHeader className="px-3 pb-2 pt-7">
            <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          </DialogHeader>
          <Separator />
          <p className="px-3 pb-6 pt-2">{content}</p>
          <Separator />
          <div className="mr-2 flex items-center justify-end space-x-3 py-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-full border-2 border-blue-600 text-blue-600 hover:border-blue-900 hover:text-blue-600"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className="rounded-full bg-blue-600 hover:bg-blue-800"
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
