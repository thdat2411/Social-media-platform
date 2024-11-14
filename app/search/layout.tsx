import React from "react";
import getCurrentUser from "../actions/getCurrentUser";
import Header from "../components/header";
import SubHeader from "../components/sub-header";

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout = async ({ children }: SearchLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <SubHeader />
      {children}
    </div>
  );
};

export default SearchLayout;
