import { Button } from "@/components/ui/button";
import { Bookmark, SquarePen } from "lucide-react";
import React from "react";

const JobSidebar = () => {
  return (
    <aside className="w-1/4 bg-white border border-[#DADEE2] rounded-lg shadow-sm h-fit">
      <div className="p-4 space-y-2 flex flex-col">
        <Button className="flex items-center space-x-3 hover:bg-white bg-white text-black justify-start">
          <Bookmark />
          <p className="">My jobs</p>
        </Button>
        <Button className="flex items-center space-x-3 hover:bg-white bg-white  justify-start text-blue-600">
          <SquarePen />
          <p className="">Post a free job</p>
        </Button>
      </div>
    </aside>
  );
};

export default JobSidebar;
