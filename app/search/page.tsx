"use client";
import NotifcationImage from "@/app/assets/notifcation_image.png";
import { job_posting, post, user } from "@prisma/client";
import axios from "axios";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FooterLink from "../components/footerLink";
import SubHeader from "../components/sub-header";
import CategoryListSidebar from "./category-list-sidebar";
import SearchMainContent from "./main-content";

const SearchPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const keyword = params.get("keyword");
  const [jobPosts, setJobPosts] = useState<job_posting[]>([]);
  const [people, setPeople] = useState<user[]>([]);
  const [posts, setPosts] = useState<post[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/search?keyword=${keyword}`);
      const data = response.data;
      console.log("data", data);
      setJobPosts(data.jobPostings.sort(() => Math.random() - 0.5));
      setPeople(data.users);
      setPosts(data.posts);
    };
    fetchData();
  }, [keyword]);
  if (jobPosts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <SubHeader />
      <div className="flex w-full justify-center">
        <div className="mt-4 flex w-[70%] justify-center max-[1650px]:w-[85%]">
          <CategoryListSidebar />
          <SearchMainContent
            jobPosts={jobPosts}
            people={people}
            posts={posts}
          />
          <div className="sticky top-20 flex h-[200px] w-[300px] flex-col space-y-6 bg-white">
            <Image
              onClick={() => router.push("/jobs")}
              src={NotifcationImage}
              width={300}
              height={300}
              alt=""
              className="cursor-pointer rounded-xl object-cover"
            />
            <FooterLink />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
