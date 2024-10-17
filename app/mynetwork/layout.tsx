"use client";
import React, { useState } from "react";
import Header from "../components/header";

interface MyNetworkLayoutProps {
  children: React.ReactNode;
}

const MyNetworkLayout = ({ children }: MyNetworkLayoutProps) => {
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  return (
    <div className="h-full">
      {isSearchFocus && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-10" />
      )}

      <Header
        // TODO: Fix properties (isSearchFocus, setIsSearchFocus) do not exist in Header.
        isSearchFocus={isSearchFocus}
        setIsSearchFocus={setIsSearchFocus}
      />
      {children}
    </div>
  );
};

export default MyNetworkLayout;
