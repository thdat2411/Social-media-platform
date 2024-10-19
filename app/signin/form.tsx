"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const LoginForm = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const callback = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (callback?.error) {
      setError(callback.error);
    } else if (callback?.ok) {
      router.push("/feed");
    }

    setIsLoading(false);
  };

  const socialAction = () => {
    setIsLoading(true);

    signIn("google", {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback.error);
        }
        if (callback?.ok && !callback.error) {
          toast.success("Logged in!");
          router.push("/feed");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-36 w-full max-w-sm rounded-lg border bg-white p-8 shadow-md">
      <h2 className="mb-4 text-3xl font-semibold">Log in</h2>
      <Button
        onClick={socialAction}
        variant="outline"
        className="flex w-full justify-between space-x-2 rounded-full border border-gray-600 px-4 py-4"
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
              <ChevronDown className="mt-0.5 size-3" />
            </div>
          </div>
        </div>
        <FcGoogle className="size-7" />
      </Button>
      <div className="my-4 flex items-center">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      {error !== "" && (
        <p className="mb-2 ml-1 text-sm font-medium text-red-500">{error}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-4">
          <input
            className={`w-full rounded-md border p-2 transition-all ${
              isEmailFocused || emailValue ? "pt-5" : "pt-2"
            }`}
            {...register("email", { required: true })}
            placeholder=""
            type="text"
            disabled={isLoading}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            required
          />
          <label
            className={`absolute left-2 top-2 text-gray-400 transition-all ${
              isEmailFocused || emailValue
                ? "-translate-y-1 transform text-xs"
                : "text-sm"
            }`}
          >
            Email or phone
          </label>
        </div>
        <div className="relative mb-4">
          <div
            className={`flex w-full items-center rounded-md border p-2 transition-all ${
              isPasswordFocused || passwordValue ? "pt-5" : "pt-2"
            } ${isPasswordFocused ? "border-black outline outline-1" : " "}`}
            onBlur={() => setIsPasswordFocused(false)}
          >
            <input
              className={`} w-full focus:outline-none`}
              {...register("password", { required: true })}
              placeholder=" "
              disabled={isLoading}
              type={!showPassword ? "password" : "text"}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />
            <label
              className={`absolute left-2 top-2 text-gray-400 transition-all ${
                isPasswordFocused || passwordValue
                  ? "-translate-y-1 transform text-xs"
                  : "text-sm"
              }`}
            >
              Password
            </label>
            {showPassword ? (
              <Eye
                onClick={() => setShowPassword(false)}
                className="size-6 cursor-pointer"
              />
            ) : (
              <EyeOff
                onClick={() => setShowPassword(true)}
                className="size-6 cursor-pointer"
              />
            )}
          </div>
        </div>
        <Link
          className="mb-4 mt-2 block text-sm font-bold text-blue-600 hover:underline"
          href="#"
        >
          Forgot password?
        </Link>
        <Button
          type="submit"
          variant="outline"
          disabled={isLoading}
          className="mt-4 h-12 w-full rounded-full bg-blue-600 p-2 text-lg font-bold text-white hover:bg-blue-800 hover:text-white"
        >
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
