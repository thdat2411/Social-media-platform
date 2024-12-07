import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import React from "react";
const SignInHeader = () => {
  return (
    <div className="absolute left-10 top-3">
      <Image alt="LinkedIn logo" src={LinkedInLogo} className="w-48" />
    </div>
  );
};

export default SignInHeader;
