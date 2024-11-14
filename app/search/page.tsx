import { job_posting, post, user } from "@prisma/client";
import { useEffect, useState } from "react";
import CategoryListSidebar from "./category-list-sidebar";
import SearchMainContent from "./main-content";

const SearchPage = () => {
  const url = new URL(window.location.href);
  const keyword = url.searchParams.get("keyword");
  const [jobPosts, setJobPosts] = useState<job_posting[]>([]);
  const [people, setPeople] = useState<user[]>([]);
  const [posts, setPosts] = useState<post[]>([]);
  useEffect(() => {
    const fetchData = async () => {};
  }, []);
  return (
    <div className="relative">
      <div className="mx-auto mt-4 flex w-full max-w-6xl">
        <CategoryListSidebar />
        <SearchMainContent />
      </div>
    </div>
  );
};

export default SearchPage;
