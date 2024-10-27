import React from "react";
import Header from "../components/header";
import getCurrentUser from "../actions/getCurrentUser";

interface JobPostingLayoutProps {
  children: React.ReactNode;
}

const JobPostingLayout = async ({ children }: JobPostingLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <Header user={user!} />
      {children}
    </div>
  );
};

export default JobPostingLayout;
