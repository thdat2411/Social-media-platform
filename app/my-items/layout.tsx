import React from "react";
import Header from "../components/header";

interface MyItemsLayoutProps {
  children: React.ReactNode;
}

const MyItemsLayout = ({ children }: MyItemsLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default MyItemsLayout;
