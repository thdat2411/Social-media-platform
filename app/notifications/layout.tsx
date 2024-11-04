import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Header from "@/app/components/header";

interface NotificationsLayoutProps {
  children: React.ReactNode;
}

const UserProfileLayout = async ({ children }: NotificationsLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <Header user={user!} />
      {children}
    </div>
  );
};

export default UserProfileLayout;
