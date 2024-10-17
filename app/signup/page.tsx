import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import SignUpFooter from "./footer";
import SignUpForm from "./form";

const SignUpPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Image
        alt="LinkedIn logo"
        className="ml-[450px] w-48"
        src={LinkedInLogo}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl mb-6">
          Make the most of your professional life
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md border max-w-md mx-auto">
          <SignUpForm />
        </div>
        <SignUpFooter />
      </div>
    </div>
  );
};

export default SignUpPage;
