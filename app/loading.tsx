"use client";
import React, { useEffect, useState } from "react";

const LoadingPage = ({ duration }: { duration: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 100 / (duration / 100), 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);
  return (
    <div className="mt-48 flex h-screen justify-center">
      <div className="text-center">
        <div className="mb-4 flex flex-col items-center justify-center">
          <div className="flex">
            <span className="text-5xl font-bold text-blue-700">Linked</span>
            <div className="ml-1 rounded-sm bg-blue-700 px-1 text-5xl font-bold text-white">
              in
            </div>
          </div>
          <div className="relative mt-10 h-0.5 w-44 rounded-full bg-gray-300">
            <div
              className="absolute left-0 top-0 h-1 bg-blue-700"
              style={{ width: `${progress}%`, transition: "width 0.1s ease" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
