"use client";
import { JobsPost, JobsPostList } from "@/app/utils/utils";
import React, { useEffect, useState } from "react";
import JobListSideBar from "./job-list-sidebar";

const JobSearchPage = () => {
  const jobs: JobsPost[] = JobsPostList;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });
  return (
    <div className="flex flex-1 overflow-hidden justify-center z-10">
      <aside className=" bg-white w-[450px]">
        {!isLoading ? (
          <div className="p-4">
            <h2 className="text-xl font-bold">intern in Vietnam</h2>
            <p className="text-gray-600">{jobs.length} results</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="w-[300px] h-4 bg-gray-400 rounded-full mb-2" />
            <div className="w-[200px] h-4 bg-gray-400 rounded-full" />
          </div>
        )}
        <div className="h-[77vh] overflow-y-auto">
          <div className="border-b ">
            {jobs.map((job, index) => (
              <JobListSideBar
                key={index}
                data={job}
                isSelection={index === 0 ? true : false}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1 bg-white max-w-[700px] p-10 h-[85vh] overflow-y-auto">
        <div className="flex items-start space-x-4 ">
          <img
            src="https://placehold.co/50x50"
            alt="Company logo"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-2xl font-bold">Data Science Intern 2025</h1>
            <p className="text-gray-600">Visa</p>
            <p className="text-gray-600">
              Thanh Binh, Dong Nai, Vietnam · 14 hours ago · 14 applicants
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">
                Internship · Internship
              </span>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded">
                Skills: Data Science, Data Analytics, +8 more
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Easy Apply
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold">About the job</h2>
          <h3 className="text-lg font-bold mt-4">Company Description</h3>
          <p className="text-gray-600 mt-2">
            Visa is a world leader in payments and technology, with over 259
            billion payments transactions flowing safely between consumers,
            merchants, financial institutions, and government entities in more
            than 200 countries and territories each year. Our mission is to
            connect the world through the most innovative, convenient, reliable,
            and secure payments network, enabling individuals, businesses, and
            economies to thrive while driven by a common purpose – to uplift
            everyone, everywhere by being the best way to pay and be paid.
          </p>
          <p className="text-gray-600 mt-2">
            Make an impact with a purpose-driven industry leader. Join us today
            and experience Life at Visa.
          </p>
          <h3 className="text-lg font-bold mt-4">Job Description</h3>
          <p className="text-gray-600 mt-2">
            The Visa Internship Program is an exciting opportunity to propel
            your career from the center of payments innovation in Asia Pacific.
            Throughout your 12 weeks at Visa, you will be empowered to take on
            impactful work and lead courageously to shape the future of
            commerce. Gain executive exposure, engage in out-of-the-box problem
            solving, and experience the Visa culture.
          </p>
          <p className="text-gray-600 mt-2">
            The Visa Internship Program is an exciting opportunity to propel
            your career from the center of payments innovation in Asia Pacific.
            Throughout your 12 weeks at Visa, you will be empowered to take on
            impactful work and lead courageously to shape the future of
            commerce. Gain executive exposure, engage in out-of-the-box problem
            solving, and experience the Visa culture.
          </p>
          <p className="text-gray-600 mt-2">
            The Visa Internship Program is an exciting opportunity to propel
            your career from the center of payments innovation in Asia Pacific.
            Throughout your 12 weeks at Visa, you will be empowered to take on
            impactful work and lead courageously to shape the future of
            commerce. Gain executive exposure, engage in out-of-the-box problem
            solving, and experience the Visa culture.
          </p>
          <p className="text-gray-600 mt-2">
            The Visa Internship Program is an exciting opportunity to propel
            your career from the center of payments innovation in Asia Pacific.
            Throughout your 12 weeks at Visa, you will be empowered to take on
            impactful work and lead courageously to shape the future of
            commerce. Gain executive exposure, engage in out-of-the-box problem
            solving, and experience the Visa culture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
