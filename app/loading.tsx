"use client";
import React, { useEffect, useState } from "react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + direction * 20; // Adjust increment for speed
        if (newProgress >= 100) {
          setDirection(-1); // Change to right to left
          return 100;
        }
        if (newProgress <= 0) {
          setDirection(1); // Change to left to right
          return 0;
        }
        return newProgress;
      });
    }, 100);

    // Simulate loading completion after a short delay

    return () => {
      clearInterval(interval);
    };
  }, [progress, direction]);
  return (
    <div className="flex mt-48 justify-center h-screen">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex">
            <span className="text-blue-700 text-5xl font-bold">Linked</span>
            <div className="bg-blue-700 text-white text-5xl font-bold rounded-sm ml-1 px-1">
              in
            </div>
          </div>
          <div className="relative w-44 h-0.5 bg-gray-300 mt-10 rounded-full">
            <div
              className="absolute top-0 left-0 h-1 bg-blue-700"
              style={{ width: `${progress}%`, transition: "width 0.1s ease" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
