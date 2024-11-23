"use client";
import NotifcationImage from "@/app/assets/notifcation_image.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import axios from "axios";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FooterLink from "../components/footerLink";

const MyNetworkPage = () => {
  const router = useRouter();
  const [myNetwork, setMyNetwork] = useState<user[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchMyNetwork = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/network");
      const data = response.data;
      setMyNetwork(data.networks);
      setIsLoading(false);
    };
    fetchMyNetwork();
  }, []);
  const handleRemove = (id: string) => {
    setMyNetwork(myNetwork?.filter((user) => user.id !== id));
  };
  return (
    <div className="relative flex w-full justify-center">
      <div className="mt-6 flex w-[70%] justify-around max-[1600px]:w-[80%] max-[1400px]:w-[85%] max-[900px]:flex-col-reverse max-[900px]:items-center max-[900px]:justify-center max-[900px]:space-y-4">
        <div className="sticky top-20 flex w-[24%] flex-col items-center space-y-4 max-[900px]:relative max-[900px]:top-0 max-[900px]:w-[70%] max-[900px]:justify-center">
          <Image
            onClick={() => router.push("/jobs")}
            src={NotifcationImage}
            width={350}
            height={350}
            alt=""
            className="cursor-pointer rounded-xl object-cover"
          />
          <FooterLink />
        </div>

        <div className="mx-4 w-[70%] max-[900px]:w-[85%]">
          <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white p-6 shadow-sm">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader className="size-9 animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-lg">People you may know</p>
                <div className="flex flex-wrap justify-between">
                  {myNetwork?.slice(0, 8).map((user) => (
                    <div
                      key={user.id}
                      className="mt-4 flex h-[260px] w-[23%] flex-col items-center rounded-lg border bg-white shadow-sm max-[1250px]:w-[30%]"
                    >
                      {!user.headline_image ? (
                        <>
                          <div className="relative flex h-40 w-full bg-gray-200">
                            <button
                              onClick={() => handleRemove(user.id)}
                              className="absolute right-2 top-2 rounded-full bg-slate-700 p-1 hover:bg-black"
                            >
                              <X className="size-5" color="white" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <Image
                          src={user.headline_image}
                          alt=""
                          height={200}
                          width={200}
                          className="h-16 w-full object-cover"
                        />
                      )}
                      <div className="relative -mt-10 flex justify-center">
                        <Avatar className="size-[100px]">
                          <AvatarImage
                            src={user?.image ?? ""}
                            className="rounded-full"
                          />
                          <AvatarFallback className="bg-blue-300 text-3xl font-bold text-white">
                            {user.name
                              .split(" ")
                              .pop()
                              ?.charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="mt-2 text-base font-semibold">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.bio}
                      </p>
                      <div className="flex h-full w-full flex-col justify-end p-4">
                        <Button
                          variant="outline"
                          className="justify-self-end rounded-full font-bold text-blue-500 outline outline-1 outline-blue-500 hover:bg-blue-100 hover:text-blue-500 hover:outline-2 hover:outline-blue-700"
                        >
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNetworkPage;
