import LinkedLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import React from "react";

const FooterLink = () => {
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
    <>
      <ul className="flex h-[100px] w-fit flex-wrap items-center justify-center">
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
    </>
  );
};

export default FooterLink;
