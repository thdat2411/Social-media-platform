import React from "react";
import Header from "../components/header";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const FeedLayout = ({ children }: SearchLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default FeedLayout;
