import React from "react";
import UserProfileMainContent from "./main-content";
const UserProfilePage = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-6xl">
        <UserProfileMainContent />
      </div>
    </div>
  );
};

export default UserProfilePage;
