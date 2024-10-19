import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaLinkedin,
  FaPhoneAlt,
} from "react-icons/fa";

interface ContactInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ContactInfoModal = ({ open, setOpen }: ContactInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="absolute top-72 bg-white">
        <DialogHeader className="p-3">
          <DialogTitle>User Name</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col space-y-4 px-2 pb-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg">Contact Info</p>
            <Button variant="ghost" className="rounded-full p-3">
              <Pencil className="size-5" />
            </Button>
          </div>
          <div className="flex space-x-4">
            <FaLinkedin className="size-6" />
            <div className="flex flex-col">
              <p className="font-medium">Your profile</p>
              <Link href="#" className="text-sm text-blue-500 hover:underline">
                linkedin.com/in/username
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaPhoneAlt className="size-5" />
            <div className="flex flex-col">
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">user phone number</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaEnvelope className="size-5" />
            <div className="flex flex-col">
              <p className="font-medium">Email</p>
              <Link href="#" className="text-sm text-blue-500 hover:underline">
                User email
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaCalendarAlt className="size-5" />
            <div className="flex flex-col">
              <p className="font-medium">Birthday</p>
              <p className="text-sm text-muted-foreground hover:underline">
                MM/dd
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoModal;
