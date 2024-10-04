import React from "react";
import Header from "../components/header";

interface JobPostingLayoutProps {
  children: React.ReactNode;
}

const JobPostingLayout = ({ children }: JobPostingLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default JobPostingLayout;
