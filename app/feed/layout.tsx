import React, { Suspense } from "react";
import getCurrentUser from "../actions/getCurrentUser";
import Header from "../components/header";
import LoadingPage from "../loading";

interface FeedLayoutProps {
  children: React.ReactNode;
}

const FeedLayout = async ({ children }: FeedLayoutProps) => {
  const user = await getCurrentUser();
  return (
    <div className="h-full">
      <Suspense fallback={<LoadingPage />}>
        <Header user={user!} />
        {children}
      </Suspense>
    </div>
  );
};

export default FeedLayout;
