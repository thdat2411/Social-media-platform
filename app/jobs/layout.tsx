import React from "react";
import getCurrentUser from "../actions/getCurrentUser";
import Header from "../components/header";

interface JobsLayoutProps {
  children: React.ReactNode;
}

const JobsLayout = async ({ children }: JobsLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <Header user={user!} />
      {children}
    </div>
  );
};

export default JobsLayout;
