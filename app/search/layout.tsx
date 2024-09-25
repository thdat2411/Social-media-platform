"use client";
import React, { useState } from "react";
import Header from "../components/header";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout = ({ children }: SearchLayoutProps) => {
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  return (
    <div className="h-full">
      {isSearchFocus && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-10" />
      )}
      <Header
        isSearchFocus={isSearchFocus}
        setIsSearchFocus={setIsSearchFocus}
      />
      {children}
    </div>
  );
};

export default SearchLayout;
