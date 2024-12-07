import ApplicationImage from "@/app/assets/application.png";
import { application } from "@/app/my-items/my-application/main-content";
import { formatDate } from "@/app/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import React from "react";

interface ManageApplicationSideBarProps {
  data: application;
  applications: application[];
  isSelection: boolean;
  setApplicationIndex: (index: number) => void;
}

const ManageApplicationSideBar = ({
  data,
  applications,
  isSelection,
  setApplicationIndex,
}: ManageApplicationSideBarProps) => {
  return (
    <div
      onClick={() => {
        setApplicationIndex(applications.indexOf(data));
      }}
      className={`flex cursor-pointer items-start justify-between space-x-4 border-b py-8 pl-10 pr-4 ${
        isSelection ? "border-b-2 border-l-2 border-l-black bg-slate-200" : ""
      }`}
    >
      <div className="flex">
        <div className="flex">
          <Image src={ApplicationImage} alt="" className="size-16" />
          <div className="ml-3 flex flex-col space-y-2">
            <p className="text-xl font-semibold">{data.job_listings?.title}</p>
            <div className="flex items-center space-x-2 text-sm">
              <p>posted by</p>
              <div className="flex items-center space-x-1">
                <Avatar className="size-8">
                  <AvatarImage
                    src={data?.job_listings?.user?.image ?? ""}
                    className="rounded-full"
                  />
                  <AvatarFallback className="size-8 bg-blue-300 text-base font-medium text-white">
                    {data?.job_listings?.user?.name.split(" ").pop()?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg font-medium">
                  {data.job_listings?.user?.name}
                </p>
              </div>
            </div>
            <p className="text-xs">
              applied{" "}
              {data.created_at ? formatDate(new Date(data.created_at)) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageApplicationSideBar;
