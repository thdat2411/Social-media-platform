import React from "react";
import Header from "../components/header";
import SubHeader from "../components/sub-header";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout = ({ children }: SearchLayoutProps) => {
  return (
    <div className="h-full">
      <Header />
      <SubHeader />
      {children}
    </div>
  );
};

export default SearchLayout;
