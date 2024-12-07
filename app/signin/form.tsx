"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import {signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  const session = useSession();
  const [user, setUser] = useState<{
    name?: string;
    image?: string;
    email?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  useEffect(() => {
    if (session?.status === "authenticated") {
      const isLoginByGoogle = sessionStorage.getItem("isLoginByGoogle");
      if (isLoginByGoogle === "true") {
        const existingData = Cookies.get("user_data");
        if (!existingData && session?.data.user) {
          Cookies.set(
            "user_data",
            JSON.stringify({
              email: session?.data.user.email,
              name: session?.data.user.name,
              image: session?.data.user.image,
            }),
            { expires: 30, secure: true, sameSite: "Strict" }
          );
        }
      }
      router.push("/feed");
    }
  }, [session?.status, router]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setError("");

    await signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          setError(callback.error);
        }
        if (callback?.ok) {
          toast.success("Logged in!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const socialAction = () => {
    setIsLoading(true);

    signIn("google")
      .then(() => {
        console.log("Sign-in successful.");
      })
      .catch((error) => {
        toast.error("Sign-in failed.");
        console.error(error);
      })
      .finally(() => {
        console.log("Sign-in completed.");
        sessionStorage.setItem("isLoginByGoogle", "true");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, [router]);

  return (
    <div className="mt-36 w-full max-w-sm rounded-lg border bg-white p-8 shadow-md">
      <h2 className="mb-4 text-3xl font-semibold">Log in</h2>
      <Button
        onClick={socialAction}
        variant="outline"
        className="flex w-full justify-between space-x-2 rounded-full border border-gray-600 px-4 py-4"
      >
        {user ? (
          <>
            <Avatar>
              <AvatarImage src={user?.image || ""} className="size-8" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-xs">
              <strong className="text-gray-600">
                Continue as {user?.name}
              </strong>
              <div className="flex space-x-1">
                <span className="text-gray-600">{user?.email}</span>
                <ChevronDown className="mt-0.5 size-3" />
              </div>
            </div>
          </>
        ) : (
          <div className="space-x flex items-center">
            <p>Login with your Google</p>
          </div>
        )}
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
            {...register("email", { required: "Email is required" })}
            className={`w-full rounded-md border p-2 transition-all ${
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
                ? "-translate-y-1 transform text-xs"
                : "text-sm"
            }`}
          >
            Email
          </label>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message as string}
            </p>
          )}
        </div>
        <div className="relative mb-4">
          <div
            className={`flex w-full items-center rounded-md border p-2 transition-all ${
              isPasswordFocused || passwordValue !== "" ? "pt-5" : "pt-2"
            } ${isPasswordFocused ? "border-black outline outline-1" : " "}`}
            onBlur={() => setIsPasswordFocused(false)}
          >
            <input
              className={`} w-full focus:outline-none`}
              {...register("password", { required: "Password is required" })}
              placeholder=" "
              disabled={isLoading}
              type={!showPassword ? "password" : "text"}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <label
              className={`absolute left-2 top-2 text-gray-400 transition-all ${
                isPasswordFocused || passwordValue !== "" || passwordValue
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message as string}
            </p>
          )}
        </div>
        <Link
          className="mb-4 mt-2 block text-sm font-bold text-blue-600 hover:underline"
          href="/forgot-password"
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
