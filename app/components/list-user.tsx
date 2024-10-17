import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import React from "react";

const ListUser = () => {
  const users = [1, 2, 3, 4];
  return (
    <div className="w-1/4 bg-white rounded-lg border shadow-md h-fit">
      <div className="flex flex-col space-y-2 p-4">
        <p className="font-semibold text-xl pb-4">People you may know</p>
        {users.map((user, index) => (
          <>
            <div className="flex space-x-4" key={user}>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="size-16 rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2 mb-4">
                <p className="font-semibold">User Name</p>
                <p className="text-sm">
                  One of user features (school, company, etc..)
                </p>
                <Button
                  className="rounded-full w-fit border-2 border-slate-500 hover:border-black space-x-2 items-center flex"
                  variant="outline"
                >
                  <MessageCircle className="size-5" />
                  <p>Connect</p>
                </Button>
              </div>
            </div>
            {users.length - 1 !== index && <Separator />}
          </>
        ))}
      </div>
      <Separator />
      <Button variant="ghost" className="w-full h-12">
        <p className=" text-base text-gray-500">Show all</p>
      </Button>
    </div>
  );
};

export default ListUser;
