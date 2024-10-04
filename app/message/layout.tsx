import React from "react";
import Header from "../components/header";

interface MessageLayoutProps {
  children: React.ReactNode;
}

const MessageLayout = ({ children }: MessageLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      {children}
    </div>
  );
};

export default MessageLayout;
