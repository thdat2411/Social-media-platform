import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { Toaster } from "sonner";
import Header from "./components/header";
import AuthContext from "./context/AuthContext";
import { NotificationProvider } from "./context/NoftificationContext";
import { PusherProvider } from "./context/PusherContext";
import "./globals.css";
import LoadingPage from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<LoadingPage />}>
          <AuthContext>
            <PusherProvider>
              <NotificationProvider>
                <Toaster richColors visibleToasts={5} duration={5000} />
                <div className="h-full">
                  <Header />
                  {children}
                </div>
              </NotificationProvider>
            </PusherProvider>
          </AuthContext>
        </Suspense>
      </body>
    </html>
  );
}
