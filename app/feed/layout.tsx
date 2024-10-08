import React from "react";
import Header from "../components/header";

interface FeedLayoutProps {
  children: React.ReactNode;
}

const FeedLayout = ({ children }: FeedLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default FeedLayout;
