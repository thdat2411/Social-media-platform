"use client";
import { Button } from "@/components/ui/button";
import { Bookmark, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const JobSidebar = () => {
  const router = useRouter();
  return (
    <aside className="w-1/4 bg-white border border-[#DADEE2] rounded-lg shadow-sm h-fit">
      <div className="p-4 space-y-2 flex flex-col">
        <Button className="flex items-center space-x-3 hover:bg-slate-200 bg-white text-black justify-start">
          <Bookmark />
          <p className="">My jobs</p>
        </Button>
        <Button
          onClick={() => router.push("/job-posting")}
          className="flex items-center space-x-3 hover:bg-slate-200 bg-white  justify-start text-blue-600"
        >
          <SquarePen />
          <p className="">Post a free job</p>
        </Button>
      </div>
    </aside>
  );
};

export default JobSidebar;
