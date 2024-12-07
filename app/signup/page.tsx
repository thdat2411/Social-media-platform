import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import SignUpFooter from "./footer";
import SignUpMainContent from "./main-content";

const SignUpPage = () => {
  return (
    <div className="relative flex h-screen flex-col justify-center">
      <Image
        alt="LinkedIn logo"
        className="absolute left-[25%] top-3 w-48"
        src={LinkedInLogo}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <SignUpMainContent />
        <SignUpFooter />
      </div>
    </div>
  );
};

export default SignUpPage;
