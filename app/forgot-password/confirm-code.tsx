import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ChangePasswordForm from "./change-password";

interface ConfirmCodeFormProps {
  codeValue: string;
  emailValue: string;
  setIsValid: (value: boolean) => void;
  reSend: () => void;
}

const ConfirmCodeForm = ({
  codeValue,
  emailValue,
  setIsValid,
  reSend,
}: ConfirmCodeFormProps) => {
  const [enteredCode, setEnteredCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCodeConfirm, setIsCodeConfirm] = useState(false);

  const handleSubmit = () => {
    if (enteredCode !== codeValue) {
      setIsError(true);
      return;
    }
    setIsCodeConfirm(true);
  };

  return (
    <>
      {!isCodeConfirm ? (
        <ChangePasswordForm emailValue={emailValue} />
      ) : (
        <>
          <p className="mb-10 text-3xl font-medium">Enter the 6-digit code</p>
          <p className="text-sm">
            Check{" "}
            <span className="font-medium">
              {emailValue.charAt(0)}*****@gmail.com
            </span>{" "}
            for a verification code{" "}
          </p>
          <Button
            onClick={() => setIsValid(false)}
            variant="ghost"
            className="mb-6 w-fit rounded-md px-1 py-0 text-sm text-blue-600 hover:text-blue-600"
          >
            <p className="text-sm">Change</p>
          </Button>
          <input
            value={enteredCode}
            className={`h-[55px] w-full rounded-md border p-3 text-xl ${isError ? "border-red-500 outline outline-1 outline-red-500" : "border-gray-700 focus:outline-blue-500"} } transition-all`}
            type="text"
            placeholder="6-digit code"
            maxLength={6}
            onChange={(e) => setEnteredCode(e.target.value)}
            style={{
              letterSpacing: "8px", // Adjust the spacing as needed
            }}
          />
          {isError && (
            <p className="mt-1 text-sm font-medium text-red-500">
              That&apos;s not a right code
            </p>
          )}
          <Button
            onClick={reSend}
            variant="ghost"
            className="mb-6 mt-2 w-fit rounded-md px-1 py-0 text-sm text-blue-600 hover:text-blue-600"
          >
            <p className="text-sm">Resend code</p>
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-14 w-full rounded-full bg-blue-500 text-lg hover:bg-blue-700"
          >
            Submit
          </Button>
          <p className="mt-10 text-sm font-light text-gray-600">
            If you don’t see the email in your inbox, check your spam folder. If
            it’s not there, the email address may not be confirmed, or it may
            not match an existing LinkedIn account.
          </p>
        </>
      )}
    </>
  );
};

export default ConfirmCodeForm;
