import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface EmailInputFormProps {
  emailValue: string;
  setEmailValue: (value: string) => void;
  isError: boolean;
  isEmailFocused: boolean;
  setIsEmailFocused: (value: boolean) => void;
  handleSubmit: () => void;
}

const EmailInputForm = ({
  emailValue,
  setEmailValue,
  isError,
  isEmailFocused,
  setIsEmailFocused,
  handleSubmit,
}: EmailInputFormProps) => {
  const router = useRouter();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div>
      <>
        <p className="mb-10 text-3xl font-medium">Forgot Password</p>
        <div className="relative mb-4" onKeyDown={handleKeyDown}>
          <input
            value={emailValue}
            className={`h-[65px] w-full rounded-md border px-3 py-1 ${isError ? "border-red-500 outline outline-1 outline-red-500" : "border-gray-700 focus:outline-blue-500"} transition-all ${
              isEmailFocused || emailValue !== "" ? "pt-5" : "pt-2"
            }`}
            type="email"
            onChange={(e) => setEmailValue(e.target.value)}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
          <label
            className={`absolute left-3 top-4 ${isError ? "text-red-500" : "text-gray-700"} font-light transition-all ${
              isEmailFocused || emailValue !== ""
                ? "-translate-y-3 transform text-base font-medium"
                : "text-xl text-gray-500"
            }`}
          >
            Email
          </label>
        </div>
        {isError && (
          <p className="text-sm font-medium text-red-500">
            Please enter your email
          </p>
        )}
        <p className="my-5 text-sm">
          We’ll send a verification code to this email or phone number if it
          matches an existing LinkedIn account.
        </p>
        <Button
          onClick={handleSubmit}
          className="h-14 w-full rounded-full bg-blue-500 text-lg hover:bg-blue-700"
        >
          Next
        </Button>
        <div className="mt-4 flex items-center justify-center text-gray-500 hover:text-black hover:underline">
          <Button
            onClick={() => router.push("/signIn")}
            variant="ghost"
            className="rounded-full"
          >
            Back
          </Button>
        </div>
      </>
    </div>
  );
};

export default EmailInputForm;
