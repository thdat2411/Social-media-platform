"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LandingImage from "@/app/assets/landing-image.jpg";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const LandingMainContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/feed");
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
  return (
    <main className="flex max-[700px]:flex-col justify-center space-x-10 max-[700px]:space-x-0 max-[700px]:space-y-10 mt-20 ">
      <div className="flex flex-col w-[550px] max-[700px]:w-full max-[700px]:justify-center max-[700px]:self-center">
        <h1 className="text-5xl text-slate-500 max-[700px]:text-center max-[700px]:break-words max-[700px]:text-3xl">
          Chào mừng đến với cộng đồng chuyên gia của bạn
        </h1>
        <div className="max-[700px]:self-center">
          <Button
            disabled={isLoading}
            onClick={socialAction}
            variant="outline"
            className="mt-8 w-[400px] border-gray-600 bg-white flex space-x-2 border rounded-full px-4 py-4 h-11 justify-between"
          >
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="size-8"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
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
            onClick={() => router.push("/signin")}
            variant="outline"
            className="mt-6 border w-[400px] bg-white border-gray-600 rounded-full px-6 py-2"
            disabled={isLoading}
          >
            Đăng nhập bằng email
          </Button>

          <p className="mt-4 text-xs text-gray-600 items-start w-[400px] text-center">
            Khi nhấp vào Tiếp tục để tham gia hoặc đăng nhập, bạn đồng ý với{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Thỏa thuận người dùng
            </a>
            ,{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Chính sách quyền riêng tư
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Chính sách cookie
            </a>{" "}
            của LinkedIn.
          </p>
          <p className="mt-4 text-gray-600 items-start w-[400px] text-center">
            Bạn mới sử dụng LinkedIn?{" "}
            <Link
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Tham gia ngay
            </Link>
          </p>
        </div>
      </div>
      <div className="max-[700px]:self-center">
        <Image
          src={LandingImage}
          alt="Illustration"
          className=" bg-transparent rounded-full"
          width={650}
          height={520}
        />
      </div>
    </main>
  );
};

export default LandingMainContent;
