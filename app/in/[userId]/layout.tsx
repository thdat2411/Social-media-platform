import React from "react";
import Header from "../../components/header";
import getCurrentUser from "../../actions/getCurrentUser";

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

const UserProfileLayout = async ({ children }: UserProfileLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <Header user={user!} />
      {children}
    </div>
  );
};

export default UserProfileLayout;
