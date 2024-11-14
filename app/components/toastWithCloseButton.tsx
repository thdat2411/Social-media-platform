import { formatDate } from "date-fns";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const useShowToastWithCloseButton = () => {
  const router = useRouter();

  const showToastWithCloseButton = (message: string) => {
    toast.custom((t) => (
      <>
        <div
          onClick={() => router.push("/notifications")}
          className="flex w-[350px] flex-col items-center justify-between space-y-2 rounded-lg bg-white p-4 shadow-lg"
        >
          <div className="flex w-[350px] items-center justify-between px-4 pb-2 pt-4">
            <button className="flex flex-grow items-center space-x-2 text-left text-gray-800">
              <Bell className="size-5" />
              <p className="break-words text-lg font-medium">New message</p>
            </button>
            <button
              onClick={() => toast.dismiss(t)} // Dismiss the toast
              className="ml-4"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="text self-start">{message}</p>
          <p className="self-end text-xs text-gray-500">
            {formatDate(new Date(), "HH:mm - dd/MM ")}
          </p>
        </div>
      </>
    ));
  };

  return showToastWithCloseButton;
};
