"use client";
import LinkedLogo from "@/app/assets/LinkedIn-Logo.svg";
import NotifcationImage from "@/app/assets/notifcation_image.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import NotificationMainContent from "./main-content";

const NotificationPage = () => {
  const router = useRouter();
  const footerLinks = [
    "About",
    "Accessibility",
    "Help",
    "Privacy",
    "Ad choices",
    "Advertising",
    "Business Services",
    "Get the LinkedIn app",
    "More",
  ];
  return (
    <div className="relative flex h-full">
      <div className="mx-auto mt-4 flex w-full max-w-6xl justify-center max-[700px]:flex-col min-[1000px]:flex-1 min-[1000px]:justify-start">
        <div className="sticky top-20 flex h-[100px] flex-col bg-white max-[1200px]:w-1/4 max-[700px]:w-full min-[1200px]:w-1/5">
          <aside className="flex h-full flex-col items-center justify-center rounded-lg border p-4 shadow-sm">
            <p className="text-xl font-semibold">Notifications</p>
          </aside>
        </div>
        <NotificationMainContent />
        <div className="sticky top-20 flex h-[200px] w-[300px] flex-col space-y-6 bg-white">
          <Image
            onClick={() => router.push("/jobs")}
            src={NotifcationImage}
            width={300}
            height={300}
            alt=""
            className="cursor-pointer rounded-xl object-cover"
          />
          <ul className="flex h-[200px] w-fit flex-wrap items-center justify-center">
            {footerLinks.map((link) => (
              <li
                className="mx-2 my-1 cursor-pointer text-xs font-light text-gray-600 hover:underline"
                key={link}
              >
                {link}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center">
            <Image src={LinkedLogo} width={70} height={70} alt="" />
            <p className="text-xs">LinkedIn Corporation © 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
