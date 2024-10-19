import React from "react";
import SubHeader from "../../../components/sub-header";

interface JobSearchLayoutProps {
  children: React.ReactNode;
}

const JobSearchLayout = ({ children }: JobSearchLayoutProps) => {
  return (
    <div className="h-[93vh] overflow-hidden">
      <SubHeader />
      {children}
    </div>
  );
};

export default JobSearchLayout;
