"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  return (
    <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg mt-36">
      <h2 className="text-3xl font-semibold mb-4">Log in</h2>
      <Button
        variant="outline"
        className="w-full border-gray-600 flex space-x-2 border rounded-full px-4 py-4 justify-between"
      >
        <div className="flex items-center space-x-2">
          <Image
            src="https://github.com/shadcn.png"
            alt="User Avatar"
            className="h-8 w-8 rounded-full"
            width={20}
            height={20}
          />
          <div className="flex flex-col items-start text-xs">
            <strong className="text-gray-600">Continue as Thai</strong>
            <div className="flex space-x-1">
              <span className="text-gray-600">
                thaidat.0901485160@gmail.com
              </span>
              <ChevronDown className="size-3 mt-0.5" />
            </div>
          </div>
        </div>
        <FcGoogle className="size-7" />
      </Button>
      <Button
        variant="outline"
        className="w-full border-gray-600 flex items-center justify-center border rounded-full p-2 mb-4 mt-4"
      >
        <i className="fab fa-apple text-2xl mr-2"></i>
        <span>Sign in with Apple</span>
      </Button>
      <div className="flex items-center my-4">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      <div className="relative mb-4">
        <input
          className={`w-full border rounded-md p-2 transition-all ${
            isEmailFocused ? "pt-5" : "pt-2"
          }`}
          placeholder=" "
          type="text"
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />
        <label
          className={`absolute left-2 top-2 text-gray-400 transition-all ${
            isEmailFocused ? "text-xs transform -translate-y-1" : "text-sm"
          }`}
        >
          Email or phone
        </label>
      </div>

      <div className="relative mb-4">
        <input
          className={`w-full border rounded-md p-2 transition-all ${
            isPasswordFocused ? "pt-5" : "pt-2"
          }`}
          placeholder=" "
          type="password"
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <label
          className={`absolute left-2 top-2 text-gray-400 transition-all ${
            isPasswordFocused ? "text-xs transform -translate-y-1" : "text-sm"
          }`}
        >
          Password
        </label>
        <span className="absolute right-2 top-2 text-blue-600 cursor-pointer">
          Display
        </span>
      </div>
      <Link
        className="text-blue-600 text-sm mb-4 block font-bold hover:underline mt-2"
        href="#"
      >
        Forgot password?
      </Link>
      <Button
        variant="outline"
        className="w-full hover:bg-blue-800  bg-blue-600 text-white hover:text-white rounded-full h-12  text-lg font-bold p-2 mt-4"
      >
        Log in
      </Button>
    </div>
  );
};

export default LoginForm;
