import { getCurrentJobPosting } from "@/app/actions/getCurrentJobPosting";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { job_posting, user } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditJobPostingMainContent from "./main-content";

const JobPostingEditPage = () => {
  const postedJobId = useParams().jobpostingId as string;
  const [jobPosting, setJobPosting] = useState<job_posting | null>(null);
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const job_posting = await getCurrentJobPosting(postedJobId);
      const user = await getCurrentUser();
      setJobPosting(job_posting);
      setUser(user);
    };

    fetchData();
  }, [postedJobId]);

  return <EditJobPostingMainContent job_posting={jobPosting!} user={user!} />;
};

export default JobPostingEditPage;
