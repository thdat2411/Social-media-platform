import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import React from "react";

const ListUser = () => {
  const users = [1, 2, 3, 4];
  return (
    <div className="h-fit w-1/4 rounded-lg border bg-white shadow-md">
      <div className="flex flex-col space-y-2 p-4">
        <p className="pb-4 text-xl font-semibold">People you may know</p>
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
              <div className="mb-4 flex flex-col space-y-2">
                <p className="font-semibold">User Name</p>
                <p className="text-sm">
                  One of user features (school, company, etc..)
                </p>
                <Button
                  className="flex w-fit items-center space-x-2 rounded-full border-2 border-slate-500 hover:border-black"
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
      <Button variant="ghost" className="h-12 w-full">
        <p className="text-base text-gray-500">Show all</p>
      </Button>
    </div>
  );
};

export default ListUser;
