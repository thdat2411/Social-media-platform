import React from "react";
import Header from "../components/header";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

const UserProfileLayout = ({ children }: UserProfileLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default UserProfileLayout;
