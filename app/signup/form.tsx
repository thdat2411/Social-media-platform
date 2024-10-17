"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post(`/api/register`, data)
      .then(() => {
        signIn("credentials", data);
        toast.success("Sign up successfully");
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form className="w-[350px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-left text-sm mb-2">Name</label>
          <input
            className="w-full py-2 px-4 border border-gray-300 rounded text-sm"
            required
            type="text"
            disabled={isLoading}
            {...register("name", { required: "Name is required" })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-left text-sm mb-2">Email</label>
          <input
            className="w-full py-2 px-4 border border-gray-300 rounded text-sm"
            required
            type="email"
            disabled={isLoading}
            {...register("email", { required: "Email is required" })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-left mb-2 text-sm">Password</label>
          <div className="relative">
            <input
              className="w-full py-2 px-4 border border-gray-300 rounded text-sm"
              required
              type="password"
              disabled={isLoading}
              {...register("password", { required: "Password is required" })}
            />
            <button
              className="absolute right-2 top-2 text-blue-600"
              type="button"
            >
              Show
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center text-sm">
          <input className="mr-2" id="remember" type="checkbox" />
          <label htmlFor="remember">Remember me</label>
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
            className="text-blue-600 font-medium   hover:underline"
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
