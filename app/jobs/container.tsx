import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { JobsPost } from "./main-content";
import CompanyLogo from "@/app/assets/company.png";

interface JobsContainerProps {
  item: JobsPost;
  lists: JobsPost[];
}

const JobsContainer = ({ item }: JobsContainerProps) => {
  const router = useRouter();
  return (
    <div
      key={item.id}
      className={`} mr-3 flex items-start justify-between border-b-2 border-b-[#DADEE2] p-4`}
    >
      <div
        className="flex cursor-pointer space-x-4"
        onClick={() => router.push(`/jobs/view/${item.id}`)}
      >
        <Image
          src={CompanyLogo}
          className="size-16"
          width={64}
          height={64}
          alt=""
        />
        <div className="flex flex-col space-y-1">
          <p className="text-lg font-semibold hover:underline">{item.title}</p>
          <p className="text-sm text-gray-600">{item.company_name}</p>
          <p className="text-sm text-[#9B9B9B]">{item.location}</p>
          <div className="flex flex-wrap items-center justify-start space-x-1">
            <p className="text-sm text-[#9B9B9B]">Promoted</p>
            <span className="text-lg text-[#9B9B9B]">∙</span>
            <p className="text-sm text-[#69AD97]">
              {item.applicantCount} applicants
            </p>
          </div>
        </div>
      </div>
      <Button variant="ghost" className="ml-3 rounded-full border-none p-3">
        <X className="size-5" />
      </Button>
    </div>
  );
};

export default JobsContainer;
