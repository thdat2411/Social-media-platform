import ApplicationsIcon from "@/app/assets/cv.png";
import ExitIcon from "@/app/assets/exit.png";
import UserIcon from "@/app/assets/user.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { ChevronDown, CircleUserRound, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface UserDropdownProps {
  user: user | null;
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const avatarFallBack = user?.name.split(" ").pop()?.charAt(0).toUpperCase();
  const router = useRouter();
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isExitHovered, setIsExitHovered] = useState(false);
  const [isApplicationHovered, setIsApplicationHovered] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-col items-center">
          <Avatar className="size-10">
            <AvatarImage src={user?.image ?? ""} className="rounded-full" />
            <AvatarFallback className="bg-blue-300 text-lg font-medium text-white">
              {avatarFallBack}
            </AvatarFallback>
          </Avatar>
          <div className="flex justify-center">
            <p className="text-xs">Me</p>
            <ChevronDown className="size-4" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute w-[300px] max-[1300px]:-right-10 min-[1300px]:-right-20">
        <div className="flex flex-col">
          <div
            onClick={() => router.push(`/in/${user?.id}`)}
            className="flex cursor-pointer space-x-3 p-4"
          >
            <Avatar className="size-14">
              <AvatarImage src={user?.image ?? ""} className="rounded-full" />
              <AvatarFallback className="bg-blue-300 text-2xl font-medium text-white">
                {avatarFallBack}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold">{user?.name}</p>
              <p className="break-words text-sm">
                {user?.headline ?? "No bio available"}
              </p>
            </div>
          </div>
          <Separator />
          <Button
            onClick={() => router.push(`/in?userId=${user?.id}`)}
            className="my-2 flex items-center justify-between"
            variant="ghost"
          >
            <p className="text-base">Profile</p>
            <Image src={UserIcon} alt="" className="size-6" />
          </Button>
          <Separator />
          {user?.role === "recruiter" && (
            <>
              <Button
                onClick={() => router.push("/manage-jobPosts")}
                className="my-2 flex items-center justify-between"
                variant="ghost"
              >
                <p className="text-base">Manage jobs</p>
                <Image src={ApplicationsIcon} alt="" className="size-6" />
              </Button>
              <Separator />
            </>
          )}
          <Button
            onClick={() => {
              signOut();
            }}
            className="mt-2 flex items-center justify-between"
            variant="ghost"
          >
            <p className="text-base">Sign out</p>
            <Image src={ExitIcon} alt="" className="size-6" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
