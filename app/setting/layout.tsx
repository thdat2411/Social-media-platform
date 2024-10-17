import React from "react";
import Header from "../components/header";

interface SettingLayoutProps {
  children: React.ReactNode;
}

const SettingLayout = ({ children }: SettingLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default SettingLayout;
