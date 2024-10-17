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
      <DialogContent className="bg-white absolute top-72    ">
        <DialogHeader className="p-3">
          <DialogTitle>User Name</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="px-2 flex flex-col pb-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg">Contact Info</p>
            <Button variant="ghost" className="rounded-full p-3">
              <Pencil className="size-5" />
            </Button>
          </div>
          <div className="flex space-x-4">
            <FaLinkedin className="size-6" />
            <div className="flex flex-col">
              <p className="font-medium">Your profile</p>
              <Link href="#" className="hover:underline text-sm text-blue-500">
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
              <Link href="#" className="hover:underline text-sm text-blue-500">
                User email
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaCalendarAlt className="size-5" />
            <div className="flex flex-col">
              <p className="font-medium">Birthday</p>
              <p className="hover:underline text-sm text-muted-foreground">
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
