"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (value) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/register/check-email", {
        email: value.email,
      });

      const isValidEmail = response.data.isValid;

      if (!isValidEmail) {
        setError("This email has already been registered");
      } else {
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
      }
    } catch {
      setError("An error occurred while checking email.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="w-[350px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-left text-sm font-medium">
            Name
          </label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
            required
            type="text"
            disabled={isLoading}
            {...register("name", { required: "Name is required" })}
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-left text-sm font-medium">
            Email
          </label>
          <input
            className={`w-full rounded border border-gray-300 px-4 py-2 text-sm ${
              error ? "border-red-600" : ""
            }`}
            required
            type="email"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Enter a valid email",
              },
              onChange: () => setError(""),
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message as string}
            </p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-left text-sm font-medium">
            Password
          </label>
          <div
            className={`flex rounded-md ${
              isPasswordFocused
                ? "border-black outline outline-2"
                : "outline outline-1 outline-gray-300"
            }`}
          >
            <input
              onClick={() => setIsPasswordFocused(true)}
              className="w-full px-4 focus:outline-none"
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
        <p className="mb-4 text-center text-xs text-gray-600">
          By clicking Agree and Join or Continue, you agree to LinkedIn&apos;s{" "}
          <a className="text-blue-600" href="#">
            User Agreement
          </a>
          ,
          <a className="text-blue-600" href="#">
            {" "}
            Privacy Policy
          </a>
          , and{" "}
          <a className="text-blue-600" href="#">
            Cookie Policy
          </a>
          .
        </p>
        <Button
          className="mb-4 w-full rounded-full bg-blue-500 py-2 text-base text-white hover:bg-blue-700 hover:text-white"
          type="submit"
          disabled={isLoading}
        >
          Agree and Join
        </Button>
        <div className="mb-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex w-full items-center justify-center">
          <Button
            variant="outline"
            className="flex w-[320px] justify-between space-x-2 rounded-full border border-gray-600 px-4 py-4"
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
                  <ChevronDown className="mt-0.5 size-3" />
                </div>
              </div>
            </div>
            <FcGoogle className="size-6" />
          </Button>
        </div>
        <p className="mt-10 text-center text-gray-600">
          Already have a LinkedIn account? {""}
          <Link
            className="font-medium text-blue-600 hover:underline"
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
