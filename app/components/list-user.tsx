import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ListUserProps {
  users: user[];
}

const ListUser = ({ users }: ListUserProps) => {
  const router = useRouter();
  return (
    <div className="h-fit w-fit rounded-lg border bg-white shadow-md">
      <div className="flex flex-col space-y-2 px-8 py-5 max-[1000px]:items-center">
        <p className="pb-4 text-xl font-semibold">People you may know</p>
        {users.slice(0, 5).map((user, index) => (
          <>
            <div className="flex cursor-pointer space-x-4" key={user.id}>
              <Avatar
                className="size-16"
                onClick={() => router.push(`/in?userId=${user.id}`)}
              >
                <AvatarImage src={user?.image ?? ""} className="rounded-full" />
                <AvatarFallback className="size-16 bg-blue-300 text-3xl font-medium text-white">
                  {user.name.split(" ").pop()?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <div className="mb-4 flex flex-col space-y-2">
                <div
                  className="space-y-1"
                  onClick={() => router.push(`/in?userId=${user.id}`)}
                >
                  <p className="font-semibold hover:underline">{user.name}</p>
                  <p className="text-sm">{user.headline ?? ""}</p>
                </div>
                <Button
                  className="flex w-fit items-center space-x-2 rounded-full border-2 border-slate-500 hover:border-black"
                  variant="outline"
                >
                  <MessageCircle className="size-5" />
                  <p>Connect</p>
                </Button>
              </div>
            </div>
            {users.slice(0, 5).length - 1 !== index && <Separator />}
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
