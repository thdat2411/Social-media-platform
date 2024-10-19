"use client";
import LinkedLogo from "@/app/assets/LinkedIn-Logo.svg";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiArticle } from "react-icons/pi";
const LandingHeader = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize(); // Check on initial load

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex w-full items-center justify-around bg-white">
      <div className="flex items-center">
        <Image src={LinkedLogo} alt="LinkedIn Logo" className="w-48" />
      </div>
      <div className="flex space-x-14 max-[700px]:space-x-0">
        {!isMobile && (
          <>
            <Link
              href="#"
              className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <PiArticle className="size-7" />
              <span className="text-xs">Article</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <UserRound className="size-7" />
              <span className="text-xs">Article</span>
            </Link>
            <Link
              href="#"
              className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <BriefcaseBusiness className="size-7" />
              <span className="text-xs">Article</span>
            </Link>
          </>
        )}
        <div className="overflow-auto border-l px-3">
          <Button
            onClick={() => {
              router.push("/signup");
            }}
            variant="ghost"
            className="h-12 items-center justify-center rounded-full px-4 py-1 hover:bg-slate-200"
          >
            <p className="text-base font-normal">Join now</p>
          </Button>
        </div>
        <Button
          onClick={() => {
            router.push("/signin");
          }}
          variant="outline"
          className="h-12 items-center justify-center rounded-full border-2 border-blue-600 px-6 text-blue-600 hover:text-blue-800 max-[700px]:overflow-auto"
        >
          <p className="text-base font-normal">Log in</p>
        </Button>
      </div>
    </div>
  );
};

export default LandingHeader;
