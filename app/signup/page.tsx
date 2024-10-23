import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import SignUpFooter from "./footer";
import SignUpMainContent from "./main-content";

const SignUpPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Image
        alt="LinkedIn logo"
        className="ml-[450px] w-48"
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
