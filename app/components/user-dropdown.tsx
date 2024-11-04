import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface UserDropdownProps {
  user: user;
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const avatarFallBack = user.name.split(" ").pop()?.charAt(0).toUpperCase();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-col items-center">
          <Avatar className="size-10">
            <AvatarImage src={user.image ?? ""} className="rounded-full" />
            <AvatarFallback className="bg-blue-300 text-lg text-white">
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
            onClick={() => router.push(`/in/${user.id}`)}
            className="flex cursor-pointer space-x-3 p-4"
          >
            <Avatar className="size-14">
              <AvatarImage src={user.image ?? ""} className="rounded-full" />
              <AvatarFallback className="bg-blue-300 text-lg text-white">
                {avatarFallBack}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold">{user.name}</p>
              <p className="break-words text-sm">
                {user.bio ?? "No bio available"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/in/${user.id}`)}
            className="mb-2 w-full rounded-full border-2 border-blue-500 bg-transparent text-blue-500 hover:border-blue-700 hover:bg-blue-100"
          >
            <p className="text-base">View profile</p>
          </Button>
          <Separator />
          <Button
            className="my-2 flex items-center justify-between"
            variant="ghost"
          >
            <p className="text-base">Account setting</p>
            <Settings />
          </Button>
          <Separator />
          <Button
            onClick={() => {
              signOut();
            }}
            className="mt-2 flex items-center justify-between"
            variant="ghost"
          >
            <p className="text-base">Sign out</p>
            <LogOut />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
