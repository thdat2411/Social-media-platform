"use client";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import ConfirmCodeForm from "./confirm-code";
import EmailInputForm from "./email-input";

const ForgotPasswordForm = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [codeSent, setCodeSent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async () => {
    if (emailValue === "" || !emailValue.includes("@")) {
      setIsError(true);
    } else {
      setIsError(false);

      const code = generateCode();
      setIsLoading(true);

      try {
        await axios.post("/api/email", {
          email: emailValue,
          code,
        });

        setCodeSent(code);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
        setIsValid(true);
      }
    }
  };
  return (
    <div className="mt-28 w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
      {!isValid ? (
        <EmailInputForm
          emailValue={emailValue}
          setEmailValue={setEmailValue}
          isError={isError}
          isEmailFocused={isEmailFocused}
          setIsEmailFocused={setIsEmailFocused}
          handleSubmit={handleSubmit}
        />
      ) : (
        <ConfirmCodeForm
          codeValue={codeSent}
          emailValue={emailValue}
          setIsValid={setIsValid}
          reSend={handleSubmit}
        />
      )}
      {isLoading && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="flex flex-col items-center">
            <Loader className="size-10 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
