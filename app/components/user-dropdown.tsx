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
            <AvatarFallback className="bg-blue-300 text-white text-lg">
              {avatarFallBack}
            </AvatarFallback>
          </Avatar>
          <div className="flex justify-center">
            <p className="text-xs">Me</p>
            <ChevronDown className="size-4" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] absolute -right-20">
        <div className="flex flex-col">
          <div
            onClick={() => router.push(`/in/${user.id}`)}
            className="flex p-4 space-x-3 cursor-pointer"
          >
            <Avatar className="size-14">
              <AvatarImage src={user.image ?? ""} className="rounded-full" />
              <AvatarFallback className="bg-blue-300 text-white text-lg">
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
            className="w-full rounded-full bg-transparent border-blue-500  text-blue-500 hover:bg-blue-100 hover:border-blue-700 border-2 mb-2"
          >
            <p className="text-base">View profile</p>
          </Button>
          <Separator />
          <Button
            className="flex justify-between items-center my-2"
            variant="ghost"
          >
            <p className="text-base">Account setting</p>
            <Settings />
          </Button>
          <Separator />
          <Button
            onClick={() => signOut()}
            className="flex justify-between items-center mt-2"
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
