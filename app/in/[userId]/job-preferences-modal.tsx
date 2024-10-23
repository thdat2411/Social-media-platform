import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import React from "react";

interface JobPreferenceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const JobPreferenceModal = ({ open, setOpen }: JobPreferenceModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="absolute -mt-16 max-h-[800px] max-w-xl overflow-hidden bg-white">
        <DialogHeader className="p-2">
          <DialogTitle className="text-xl">Job preferences</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="size-24"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-xl font-medium">User name</p>
                <p className="text-base font-light">is open to work</p>
              </div>
            </div>
            <Button className="rounded-full p-3" variant="ghost">
              <Pencil className="size-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-3 text-sm">
            <p className="font-medium">Job titles</p>
            <p className="text-xs">Software Engineer</p>
          </div>
          <div className="flex flex-col space-y-3 text-sm">
            <p className="font-medium">Location types</p>
            <p className="text-xs">On site ∙ Hybrid</p>
          </div>
          <div className="flex flex-col space-y-3 text-sm">
            <p className="font-medium">Location (on-site)</p>
            <p className="text-xs">Viet Nam</p>
          </div>
          <div className="flex flex-col space-y-3 text-sm">
            <p className="font-medium">Location (remote)</p>
            <p className="text-xs">Viet Nam</p>
          </div>
          <div className="flex flex-col space-y-3 pb-4 text-sm">
            <p className="font-medium">Start date</p>
            <p className="text-xs">Immediately, I am actively applying</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobPreferenceModal;
