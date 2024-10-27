"use client";
import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
const ForgotPasswordHeader = () => {
  const router = useRouter();
  return (
    <div className="flex w-full items-center justify-between">
      <div className="ml-10 w-fit">
        <Image alt="LinkedIn logo" src={LinkedInLogo} className="size-32" />
      </div>
      <div className="mr-10 flex space-x-4">
        <Button
          onClick={() => router.push("/signin")}
          variant="ghost"
          className="rounded-full text-gray-500 hover:bg-gray-300"
        >
          Sign in
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          variant="outline"
          className="hover:text-medium rounded-full border-none text-blue-500 outline outline-1 outline-blue-500 hover:text-blue-700 hover:outline-2 hover:outline-blue-700"
        >
          Join now
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordHeader;
