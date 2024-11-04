import React from "react";
import getCurrentUser from "../actions/getCurrentUser";
import Header from "../components/header";


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
