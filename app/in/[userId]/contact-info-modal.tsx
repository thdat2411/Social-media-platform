"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaLinkedin,
  FaPhoneAlt,
} from "react-icons/fa";
import EditInfoModal from "./edit-info-modal";

interface ContactInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: user;
  setUser: (value: user) => void;
}

const ContactInfoModal = ({
  open,
  setOpen,
  user,
  setUser,
}: ContactInfoModalProps) => {
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [origin, setOrigin] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);
  return (
    <>
      <EditInfoModal
        open={isEditContactModalOpen}
        setOpen={setIsEditContactModalOpen}
        user={user}
        isNestedOpen={true}
        setUser={setUser}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="absolute top-[44%] bg-white">
          <DialogHeader className="p-3">
            <DialogTitle>{user.full_name}</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col space-y-4 px-2 pb-2">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg">Contact Info</p>
              <Button
                onClick={() => {
                  setIsEditContactModalOpen(true);
                  setOpen(false);
                }}
                variant="ghost"
                className="rounded-full p-3"
              >
                <Pencil className="size-5" />
              </Button>
            </div>
            <div className="flex space-x-4">
              <FaLinkedin className="size-6" />
              <div className="flex flex-col">
                <p className="font-medium">Your profile</p>
                <Link
                  href="#"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {origin}/in/{user.id}
                </Link>
              </div>
            </div>
            <div className="flex space-x-4">
              <FaPhoneAlt className="size-5" />
              <div className="flex flex-col">
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {user.phone_number ? user.phone_number : "Add phone number"}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <FaEnvelope className="size-5" />
              <div className="flex flex-col">
                <p className="font-medium">Email</p>
                <Link
                  href="#"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {user.email}
                </Link>
              </div>
            </div>
            <div className="flex space-x-4">
              <FaCalendarAlt className="size-5" />
              <div className="flex flex-col">
                <p className="font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground hover:underline">
                  {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString()
                    : "Add birthday"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactInfoModal;
