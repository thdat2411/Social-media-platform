import LandingImage from "@/app/assets/landing-image.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const LandingMainContent = () => {
  return (
    <main className="mt-20 flex justify-center space-x-10 max-[700px]:flex-col max-[700px]:space-x-0 max-[700px]:space-y-10">
      <div className="flex w-[550px] flex-col max-[700px]:w-full max-[700px]:justify-center max-[700px]:self-center">
        <h1 className="text-5xl text-slate-500 max-[700px]:break-words max-[700px]:text-center max-[700px]:text-3xl">
          Chào mừng đến với cộng đồng chuyên gia của bạn
        </h1>
        <div className="max-[700px]:self-center">
          <Button
            variant="outline"
            className="mt-8 flex h-11 w-[400px] justify-between space-x-2 rounded-full border border-gray-600 bg-white px-4 py-4"
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
                  <ChevronDown className="mt-0.5 size-3" />
                </div>
              </div>
            </div>
            <FcGoogle className="size-7" />
          </Button>
          <Button
            variant="outline"
            className="mt-6 w-[400px] rounded-full border border-gray-600 bg-white px-6 py-2"
          >
            Đăng nhập bằng email
          </Button>

          <p className="mt-4 w-[400px] items-start text-center text-xs text-gray-600">
            Khi nhấp vào Tiếp tục để tham gia hoặc đăng nhập, bạn đồng ý với{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Thỏa thuận người dùng
            </a>
            ,{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Chính sách quyền riêng tư
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Chính sách cookie
            </a>{" "}
            của LinkedIn.
          </p>
          <p className="mt-4 w-[400px] items-start text-center text-gray-600">
            Bạn mới sử dụng LinkedIn?{" "}
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-800"
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
          className="rounded-full bg-transparent"
          width={650}
          height={520}
        />
      </div>
    </main>
  );
};

export default LandingMainContent;
