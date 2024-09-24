import React from "react";
import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
const SignInHeader = () => {
  return (
    <div className="absolute  left-10">
      <Image alt="LinkedIn logo" src={LinkedInLogo} className="w-48" />
    </div>
  );
};

export default SignInHeader;
