import React from "react";
import Header from "../components/header";

interface JobsLayoutProps {
  children: React.ReactNode;
}

const JobsLayout = ({ children }: JobsLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default JobsLayout;
