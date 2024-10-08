import React from "react";
import SubHeader from "../../../components/sub-header";

interface JobSearchLayoutProps {
  children: React.ReactNode;
}

const JobSearchLayout = ({ children }: JobSearchLayoutProps) => {
  return (
    <div className="overflow-hidden h-[93vh]">
      <SubHeader />
      {children}
    </div>
  );
};

export default JobSearchLayout;
