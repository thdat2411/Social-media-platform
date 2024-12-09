"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import axios from "axios";
import Cookies from "js-cookie";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

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
  const [providerUser, setProviderUser] = useState<user | null>(null);
  const router = useRouter();
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
          name: data?.name || "",
          id: data?.id || "",
          emailVerified: data?.emailVerified || null,
          full_name: data?.full_name || null,
          location: data?.location || null,
          birth_date: data?.birth_date || null,
          headline_image: data?.headline_image || null,
          phone_number: data?.phone_number || null,
          address: data?.address || null,
          headline: data?.headline || null,
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

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      setProviderUser(JSON.parse(userCookie));
    }
  }, [router]);

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
  return (
    <>
      <div className="w-[350px]">
        <form className="w-[350px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-2 block text-left text-sm font-medium">
              Email
            </label>
            <input
              className={`w-full rounded border border-gray-300 px-4 py-2 text-sm ${
                errors.email || error
                  ? "border-red-600 focus:outline-red-600"
                  : ""
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
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message as string}
              </p>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-left text-sm font-medium">
              Password
            </label>
            <div
              className={`flex rounded-md outline ${
                isPasswordFocused && !errors.password
                  ? "border-black outline-2"
                  : isPasswordFocused && errors.password
                    ? "outline-2 outline-red-600"
                    : "outline-1 outline-gray-300"
              } ${errors.password ? "outline-1 outline-red-600 focus:outline-red-600" : ""}`}
            >
              <input
                onClick={() => setIsPasswordFocused(true)}
                className="w-full px-4 focus:outline-none"
                required
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
                    message:
                      "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character",
                  },
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
                  <Eye className="size-5" />
                ) : (
                  <EyeOff className="size-5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message as string}
              </p>
            )}
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
        </form>
        <div className="mb-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex w-full items-center justify-center">
          <Button
            onClick={socialAction}
            variant="outline"
            className="flex w-[320px] justify-between space-x-2 rounded-full border border-gray-600 px-4 py-4"
          >
            {providerUser ? (
              <>
                <Avatar>
                  <AvatarImage
                    src={providerUser?.image || ""}
                    className="size-8"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-xs">
                  <strong className="text-gray-600">
                    Continue as {providerUser?.name}
                  </strong>
                  <div className="flex space-x-1">
                    <span className="text-gray-600">{providerUser?.email}</span>
                    <ChevronDown className="mt-0.5 size-3" />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-x flex items-center">
                <p>Login with your Google</p>
              </div>
            )}
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
      </div>
    </>
  );
};

export default SignUpForm;
