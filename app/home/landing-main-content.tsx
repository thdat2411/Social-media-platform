"use client";
import LandingImage from "@/app/assets/landing-image.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { ChevronDown } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const LandingMainContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  const [user, setUser] = useState<{
    name?: string;
    image?: string;
    email?: string;
  } | null>(null);
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/feed");
      router.refresh();
    }
  }, [session?.status, router]);

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
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    console.log(userCookie);
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, [router]);

  return (
    <main className="flex w-full justify-center space-x-10 bg-white pt-20 max-[700px]:flex-col max-[700px]:space-x-0 max-[700px]:space-y-10">
      <div className="flex w-[550px] flex-col max-[700px]:w-full max-[700px]:justify-center max-[700px]:self-center">
        <h1 className="text-5xl text-slate-500 max-[700px]:break-words max-[700px]:text-center max-[700px]:text-3xl">
          Chào mừng đến với cộng đồng chuyên gia của bạn
        </h1>
        <div className="max-[700px]:self-center">
          <Button
            disabled={isLoading}
            onClick={socialAction}
            variant="outline"
            className="mt-8 flex h-11 w-[400px] justify-between space-x-2 rounded-full border border-gray-600 bg-white px-4 py-4"
          >
            <div className="flex w-full items-center justify-center space-x-2">
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
            </div>
            <FcGoogle className="size-7" />
          </Button>
          <Button
            onClick={() => router.push("/signin")}
            variant="outline"
            className="mt-6 w-[400px] rounded-full border border-gray-600 bg-white px-6 py-2"
            disabled={isLoading}
          >
            Login with email and password
          </Button>

          <p className="mt-4 w-[400px] items-start text-center text-xs text-gray-600">
            By clicking Continue to join or log in, you agree to LinkedIn's{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              User Agreement
            </a>
            ,{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Privacy Policy
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Cookie Policy
            </a>{" "}
            of LinkedIn.
          </p>
          <p className="mt-4 w-[400px] items-start text-center text-gray-600">
            New to LinkedIn?{" "}
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Join Now
            </Link>
          </p>
        </div>
      </div>
      <div className="max-[700px]:self-center">
        <Image
          src={LandingImage}
          alt="Illustration"
          className="rounded-full bg-transparent object-cover"
          width={750}
          height={600}
        />
      </div>
    </main>
  );
};

export default LandingMainContent;
