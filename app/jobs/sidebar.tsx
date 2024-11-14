"use client";
import { Button } from "@/components/ui/button";
import { Bookmark, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const JobSidebar = () => {
  const router = useRouter();
  return (
    <aside className="h-fit w-1/4 rounded-lg border border-[#DADEE2] bg-white shadow-sm max-[900px]:w-2/4">
      <div className="flex flex-col space-y-2 p-4">
        <Button className="flex items-center justify-start space-x-3 bg-white text-black hover:bg-slate-200 max-[900px]:justify-center">
          <Bookmark />
          <p className="">My jobs</p>
        </Button>
        <Button
          onClick={() => router.push("/job-posting")}
          className="flex items-center justify-start space-x-3 bg-white text-blue-600 hover:bg-slate-200 max-[900px]:justify-center"
        >
          <SquarePen />
          <p className="">Post a free job</p>
        </Button>
      </div>
    </aside>
  );
};

export default JobSidebar;
