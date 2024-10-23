"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginForm = () => {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useSession();

  const { register, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/feed");
    }
  }, [session?.status, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    setError("");

    signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          setError(callback.error);
        }
        if (callback?.ok) {
          toast.success("Logged in!");
          router.push("/feed");
        }
      })
      .finally(() => setIsLoading(false));
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
        if (callback?.ok) {
          toast.success("Logged in!");
          router.push("/feed");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg mt-36 border">
      <h2 className="text-3xl font-semibold mb-4">Log in</h2>
      <Button
        onClick={socialAction}
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
      <div className="flex items-center my-4">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      {error !== "" && (
        <p className="text-red-500 text-sm mb-2  font-medium ml-1">{error}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative mb-4">
          <input
            {...register("email", { required: true })}
            className={`w-full border rounded-md p-2 transition-all ${
              isEmailFocused || emailValue !== "" ? "pt-5" : "pt-2"
            }`}
            type="email"
            disabled={isLoading}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
          <label
            className={`absolute left-2 top-2 text-gray-400 transition-all ${
              isEmailFocused || emailValue !== ""
                ? "text-xs transform -translate-y-1"
                : "text-sm"
            }`}
          >
            Email
          </label>
        </div>
        <div className="relative mb-4">
          <div
            className={`flex w-full border rounded-md p-2 transition-all items-center ${
              isPasswordFocused || passwordValue !== "" ? "pt-5" : "pt-2"
            } ${isPasswordFocused ? " outline outline-1 border-black" : " "}`}
            onBlur={() => setIsPasswordFocused(false)}
          >
            <input
              className={`w-full focus:outline-none
              }`}
              {...register("password", { required: true })}
              placeholder=" "
              disabled={isLoading}
              type={!showPassword ? "password" : "text"}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <label
              className={`absolute left-2 top-2 text-gray-400 transition-all ${
                isPasswordFocused || passwordValue !== "" || passwordValue
                  ? "text-xs transform -translate-y-1"
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
          className="text-blue-600 text-sm mb-4 block font-bold hover:underline mt-2"
          href="#"
        >
          Forgot password?
        </Link>
        <Button
          type="submit"
          variant="outline"
          disabled={isLoading}
          className="w-full hover:bg-blue-800  bg-blue-600 text-white hover:text-white rounded-full h-12  text-lg font-bold p-2 mt-4"
        >
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
