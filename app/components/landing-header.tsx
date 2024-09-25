import Link from "next/link";
import React from "react";
import LinkedLogo from "@/app/assets/LinkedIn-Logo.svg";
import { PiArticle } from "react-icons/pi";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const LandingHeader = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div className="w-full flex justify-around items-center bg-white">
      <div className="flex items-center">
        <Image src={LinkedLogo} alt="LinkedIn Logo" className="w-48" />
      </div>
      <div className="flex space-x-14">
        <Link
          href="#"
          className="text-gray-500 hover:text-gray-800 flex flex-col items-center justify-center"
        >
          <PiArticle className="size-7" />
          <span className="text-xs">Article</span>
        </Link>
        <Link
          href="#"
          className="text-gray-500 hover:text-gray-800 flex flex-col items-center justify-center"
        >
          <UserRound className="size-7" />
          <span className="text-xs">Article</span>
        </Link>
        <Link
          href="#"
          className="text-gray-500 hover:text-gray-800 flex flex-col items-center justify-center"
        >
          <BriefcaseBusiness className="size-7" />
          <span className="text-xs">Article</span>
        </Link>
        <div className="border-l px-3">
          <Button
            variant="ghost"
            className="hover:bg-slate-200 rounded-full px-4 py-1 h-12 items-center justify-center"
          >
            <p className="text-base font-normal">Join now</p>
          </Button>
        </div>
        <Button
          variant="outline"
          className="text-blue-600 hover:text-blue-800 border-2 items-center justify-center border-blue-600 rounded-full px-6 h-12"
        >
          <p className="text-base font-normal">Log in</p>
        </Button>
      </div>
    </div>
  );
};

export default LandingHeader;
