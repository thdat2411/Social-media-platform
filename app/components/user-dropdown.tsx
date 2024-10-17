import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import React from "react";

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-col items-center">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="size-10 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex justify-center">
            <p className="text-xs">Me</p>
            <ChevronDown className="size-4" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] absolute -right-20">
        <div className="flex flex-col">
          <div className="flex p-4 space-x-3 cursor-pointer">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="size-14 rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold">User Name</p>
              <p className="break-words text-sm">
                One of user features (school, company, etc..)
              </p>
            </div>
          </div>
          <Button className="w-full rounded-full bg-transparent border-blue-500  text-blue-500 hover:bg-blue-100 hover:border-blue-700 border-2 mb-2">
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
