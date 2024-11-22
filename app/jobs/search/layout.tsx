import React from "react";

interface JobSearchLayoutProps {
  children: React.ReactNode;
}

const JobSearchLayout = ({ children }: JobSearchLayoutProps) => {
  return <div className="h-[93vh] overflow-hidden">{children}</div>;
};

export default JobSearchLayout;
