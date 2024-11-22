import Banner3 from "@/app/assets/banner3.jpg";
import Image from "next/image";
import React from "react";
import { getJobPosts } from "../actions/getJobPosts";
import FooterLink from "../components/footerLink";
import JobsMainContent from "./main-content";
import JobSidebar from "./sidebar";

const JobsPage = async () => {
  const jobPosts = await getJobPosts();
  return (
    <div className="flex w-full flex-col">
      <div className="relative flex w-full justify-center">
        <div className="mt-6 flex w-[65%] justify-center max-[1600px]:w-[75%] max-[1400px]:w-[85%] max-[900px]:flex-col max-[900px]:items-center max-[900px]:justify-center max-[900px]:space-y-4">
          <JobSidebar />
          <JobsMainContent jobPosts={jobPosts!} />
          <div className="flex h-[250px] w-1/3 flex-col space-y-2 max-[900px]:w-[80%]">
            <Image
              src={Banner3}
              className="aspect-auto h-full rounded-lg"
              objectFit="cover"
              alt=""
            />
            <FooterLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
