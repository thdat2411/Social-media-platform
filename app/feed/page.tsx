import React from "react";
import Header from "../components/header";
import FeedSideBar from "./sidebar";
import FeedMainContent from "./main-content";

const FeedPage = () => {
  return (
    <div className="bg-gray-100">
      <Header />
      <div className="flex w-full max-w-6xl mt-4 mx-auto">
        <FeedSideBar />
        <FeedMainContent />
      </div>
    </div>
  );
};

export default FeedPage;
