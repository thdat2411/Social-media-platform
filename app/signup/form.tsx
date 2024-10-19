"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form className="w-[350px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-left text-sm">Name</label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
            required
            type="text"
            disabled={isLoading}
            {...register("name", { required: "Name is required" })}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-left text-sm">Email</label>
          <input
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
            required
            type="email"
            disabled={isLoading}
            {...register("email", { required: "Email is required" })}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-left text-sm">Password</label>
          <div className="relative">
            <input
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
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
        <p className="mb-4 text-center text-xs text-gray-600">
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
