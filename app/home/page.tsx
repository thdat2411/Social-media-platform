import Banner1 from "@/app/assets/banner1.svg";
import Banner2 from "@/app/assets/banner2.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import FooterLink from "../components/footerLink";
import LandingHeader from "./landing-header";
import LandingMainContent from "./landing-main-content";

const LandingPage = () => {
  return (
    <div className="flex h-full max-h-screen flex-col items-center">
      <LandingHeader />
      <LandingMainContent />
      <div className="flex w-full items-center justify-center py-40">
        <div className="flex w-[80%] flex-wrap justify-around">
          <div className="flex w-[550px] flex-col items-center space-y-10">
            <Image alt="" src={Banner1} className="size-72 object-cover" />
            <p className="font-base text-3xl">
              Connect with people who can help
            </p>
          </div>
          <div className="flex w-[550px] flex-col items-center space-y-10">
            <Image alt="" src={Banner2} className="size-72 object-cover" />
            <p className="font-base text-3xl">
              Learn the skills you need to succeed
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-[800px] w-full justify-center bg-white p-20">
        <div className="absolute inset-0 after:absolute after:inset-0 after:w-[100%] after:bg-[url('./assets/footer.png')] after:bg-cover after:bg-center" />
        <div className="z-10 flex w-[70%] flex-col space-y-5">
          <p className="text-[44px]">
            Join your colleagues, classmates, and friends on LinkedIn.
          </p>
          <Button className="w-fit rounded-full bg-blue-500 px-10 py-6 text-xl text-white hover:bg-blue-700">
            Begin
          </Button>
        </div>
      </div>
      <footer className="bottom-4 w-full p-8 text-center text-xs">
        <div className="flex justify-center space-x-2">
          <p className="font-bold">LinkedIn © 2024</p>
          <a className="hover:underline" href="#">
            User Agreement
          </a>
          <a className="hover:underline" href="#">
            Privacy Policy
          </a>
          <a className="hover:underline" href="#">
            Community Guidelines
          </a>
          <a className="hover:underline" href="#">
            Cookie Policy
          </a>
          <a className="hover:underline" href="#">
            Copyright Policy
          </a>
          <a className="hover:underline" href="#">
            Send feedback
          </a>
          <a className="hover:underline" href="#">
            Language
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
