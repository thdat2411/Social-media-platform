"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

import { user } from "@prisma/client";
import axios from "axios";

interface SignUpFormProps {
  setIsRegister: (value: boolean) => void;
  setData: (value: user | null) => void;
  data: user | null;
}

const SignUpForm = ({ setIsRegister, setData, data }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (value) => {
    setIsLoading(true);
    console.log(value.email);
    const response = await axios.post("/api/register/check-email", {
      email: value.email,
    });
    const isValidEmail = response.data.isValid;
    if (isValidEmail === false) {
      setError("This email has already been registered");
      setIsLoading(false);
    } else if (isValidEmail === true) {
      setData({
        ...data,
        email: value.email,
        password_hash: value.password,
        image: data?.image || null,
        name: value.name || null,
        id: data?.id || "",
        emailVerified: data?.emailVerified || null,
        full_name: data?.full_name || null,
        location: data?.location || null,
        birth_date: data?.birth_date || null,
        headline_image: data?.headline_image || null,
        phone_number: data?.phone_number || null,
        bio: data?.bio || null,
        role: data?.role || null,
        created_at: data?.created_at || null,
        updated_at: data?.updated_at || null,
      });
      setIsRegister(true);
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="w-[350px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-left text-sm mb-2 font-medium">
            Name
          </label>
          <input
            className="w-full py-2 px-4 border border-gray-300 rounded text-sm"
            required
            type="text"
            disabled={isLoading}
            {...register("name", { required: "Name is required" })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-sm mb-2 font-medium">
            Email
          </label>
          <input
            className={`w-full py-2 px-4 border border-gray-300 rounded text-sm ${
              error ? "border-red-600" : ""
            }`}
            required
            type="email"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
              onChange: () => setError(""),
            })}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-left mb-2 text-sm font-medium">
            Password
          </label>
          <div
            className={`flex rounded-md ${
              isPasswordFocused
                ? "outline outline-2 border-black"
                : "outline outline-1 outline-gray-300 "
            }`}
          >
            <input
              onClick={() => setIsPasswordFocused(true)}
              className="w-full focus:outline-none px-4"
              required
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                onBlur: () => setIsPasswordFocused(false),
              })}
            />
            <Button
              type="button"
              className="rounded-full"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-4 text-center">
          By clicking Agree and Join or Continue, you agree to LinkedIn&apos;s{" "}
          {""}
          <a className="text-blue-600" href="#">
            User Agreement
          </a>
          ,
          <a className="text-blue-600" href="#">
            {""} Privacy Policy, and {""}
          </a>{" "}
          <a className="text-blue-600" href="#">
            Cookie Policy
          </a>{" "}
          của LinkedIn.
        </p>
        <Button
          className="w-full bg-blue-500 text-base text-white py-2 rounded-full mb-4 hover:bg-blue-700 hover:text-white"
          type="submit"
          disabled={isLoading}
        >
          Agree and Join
        </Button>
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex items-center justify-center w-full">
          <Button
            variant="outline"
            className="w-[320px] border-gray-600 flex space-x-2 border rounded-full px-4 py-4 justify-between"
          >
            <div className="flex items-center space-x-2">
              <Image
                src="https://github.com/shadcn.png"
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
                width={16}
                height={16}
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
            <FcGoogle className="size-6" />
          </Button>
        </div>
        <p className="text-center text-gray-600 mt-10">
          Already have a LinkedIn account? {""}
          <Link
            className="text-blue-600 font-medium hover:underline"
            href="/signin"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignUpForm;
