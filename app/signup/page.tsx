import LinkedInLogo from "@/app/assets/LinkedIn-Logo.svg";
import Image from "next/image";
import SignUpFooter from "./footer";
import SignUpForm from "./form";

const SignUpPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <Image
        alt="LinkedIn logo"
        className="ml-[450px] w-48"
        src={LinkedInLogo}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="mb-6 text-3xl">
          Make the most of your professional life
        </h1>
        <div className="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-md">
          <SignUpForm />
        </div>
        <SignUpFooter />
      </div>
    </div>
  );
};

export default SignUpPage;
