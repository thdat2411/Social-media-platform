"use client";
import Image from "next/image";
import Link from "next/link";
import InLogo from "@/app/assets/In-logo.jpg";
import { IoSearchSharp } from "react-icons/io5";
import useRoutes from "../hooks/useRoutes";
import { useCallback, useEffect, useRef, useState } from "react";
import ConfirmModal from "./confirm-modal";
import SearchDropDown from "./search-dropdown";
import React from "react";
import { usePathname } from "next/navigation";
import { Clock4, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isJobSearchFocus, setIsJobSearchFocus] = useState(false);
  const [isLocationSearchFocus, setIsLocationSearchFocus] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [jobSearchValue, setJobSearchValue] = useState("");
  const [locationValue, setLocationValue] = useState("VietNam");
  const recentItem: string[] = ["internship", "thực tập sinh", "internship IT"];
  const trysearchItem: string[] = ["intern", "summer intern", "marketing"];
  const [isSeeAll, setIsSeeAll] = useState(false);
  const routes = useRoutes();
  const [underlineWidths, setUnderlineWidths] = useState(
    new Array(routes.length).fill(0)
  );

  const pathname = usePathname();
  const [isJobsPage, setIsJobsPage] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!routes[index].active) {
        setUnderlineWidths((prev) => {
          const newWidths = [...prev];
          newWidths[index] = 35;
          return newWidths;
        });
      }
    },
    [routes, setUnderlineWidths]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      if (!routes[index].active) {
        setUnderlineWidths((prev) => {
          const newWidths = [...prev];
          newWidths[index] = 0;
          return newWidths;
        });
      }
    },
    [routes, setUnderlineWidths]
  );

  const handleSearchJobBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget && e.relatedTarget.tagName === "BUTTON") {
      return;
    }
    setIsJobSearchFocus!(false);
    setIsSeeAll(false);
  };

  useEffect(() => {
    if (headerRef.current) {
      const links = headerRef.current.querySelectorAll(".link");
      links.forEach((link, index) => {
        link.addEventListener("mouseenter", () => handleMouseEnter(index));
        link.addEventListener("mouseleave", () => handleMouseLeave(index));
      });

      return () => {
        links.forEach((link, index) => {
          link.removeEventListener("mouseenter", () => handleMouseEnter(index));
          link.removeEventListener("mouseleave", () => handleMouseLeave(index));
        });
      };
    }
  }, [headerRef, routes, underlineWidths, handleMouseEnter, handleMouseLeave]);

  useEffect(() => {
    setIsJobsPage(/\/jobs(\/search)?(\/.*)?/.test(pathname));
  }, [pathname]);

  return (
    <>
      {(isJobSearchFocus || isLocationSearchFocus) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-10" />
      )}
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {}}
        title="Clear search history"
        content="Your search history is only visible to you, and it helps us to show you better results. Are you sure you want to clear it?"
        cancelLabel="Cancel"
        confirmLabel="Clear history"
        width="600"
      />
      <div
        ref={headerRef}
        className="w-full bg-white border-b-[1.5px] border-black  shadow-sm flex justify-around items-center z-30 sticky top-0"
      >
        <div className="flex items-center">
          <Image src={InLogo} alt="LinkedIn Logo" className="w-16 h-fit" />
          <div
            className={`flex items-center relative bg-[#EDF3F8] px-2 rounded-lg mr-2 ${
              isJobSearchFocus ? "border-black border-2" : ""
            }`}
          >
            <IoSearchSharp
              size={20}
              className="text-gray-500  transition-all duration-300"
            />
            <input
              type="text"
              value={jobSearchValue}
              placeholder={`${
                !isJobsPage ? "Search" : "Title, skills or company"
              }`}
              className={`bg-transparent text-sm py-2 px-2  focus:outline-none  ${
                isJobSearchFocus && !isJobsPage
                  ? "transition-all duration-300 w-80"
                  : !isJobSearchFocus && !isJobsPage
                  ? "transition-all duration-300 w-44"
                  : "w-44 "
              }`}
              onChange={(e) => setJobSearchValue(e.target.value)}
              onFocus={() => setIsJobSearchFocus!(true)}
              onBlur={handleSearchJobBlur}
              onClick={(e) => e.stopPropagation()}
            />
            {isJobSearchFocus && (
              <div
                className="absolute top-12 left-0 w-96 bg-white border border-gray-300 rounded-md shadow-lg"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <SearchDropDown
                  recentItem={recentItem}
                  trysearchItem={trysearchItem}
                  setIsSeeAll={setIsSeeAll}
                  setIsConfirmModalOpen={setIsConfirmModalOpen}
                  setJobSearchValue={setJobSearchValue}
                  setIsSearchFocus={setIsJobSearchFocus!}
                  isSeeAll={isSeeAll}
                />
              </div>
            )}
          </div>
          {isJobsPage && (
            <div
              className={`flex items-center relative bg-[#EDF3F8] px-2 rounded-lg ${
                isLocationSearchFocus ? "border-black border-2" : ""
              }`}
            >
              <MapPin size={20} className="text-gray-500" />
              <input
                type="text"
                value={locationValue}
                placeholder="City, state or zip code"
                className="bg-transparent text-sm py-2 px-2 w-40 focus:outline-none"
                onFocus={() => setIsLocationSearchFocus!(true)}
                onBlur={() => setIsLocationSearchFocus!(false)}
                onClick={(e) => e.stopPropagation()}
              />
              {isLocationSearchFocus && (
                <div
                  className="absolute top-12 left-0 w-96 bg-white border border-gray-300 rounded-md shadow-lg"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="p-4 space-y-3">
                    <span className="font-semibold ">Recently</span>
                    {recentItem.map((item, index) => (
                      <Button
                        onClick={() => {
                          setLocationValue(item);
                        }}
                        variant="ghost"
                        key={index}
                        className="flex w-full justify-start items-center mb-2"
                      >
                        <Clock4 size={16} className="mr-2" />
                        <span>{item}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-10 text-gray-600">
          {routes.map((route, index) => (
            <Link
              key={route.label}
              href={route.href}
              className={`link flex flex-col items-center justify-center hover:text-[#0A66C2] relative cursor-pointer ${
                route.active ? "text-gray-800" : ""
              } group`}
            >
              <div
                className={`flex flex-col items-center justify-center h-16 ${
                  underlineWidths[index] > 0 ? "flex-grow" : ""
                }`}
              >
                <route.icon
                  className={`size-6 mt-2 ${
                    route.active ? "text-[#0A66C2]" : ""
                  }`}
                />
                <p
                  className={`text-xs ${route.active ? "text-[#0A66C2]" : ""}`}
                >
                  {route.label}
                </p>

                {!route.active ? (
                  <span
                    className={`absolute bottom-0 h-0.5 bg-[#0A66C2]  rounded-full`}
                    style={{
                      width: route.active
                        ? "64px"
                        : `${underlineWidths[index]}px`,
                      transition: "width 0.5s ease-in-out",
                      transform: `scaleX(${
                        route.active ? 1 : underlineWidths[index] / 16
                      })`,
                      transformOrigin: "center",
                    }}
                  />
                ) : (
                  <span
                    className={`absolute bottom-0 justify-between  h-0.5 bg-[#0A66C2] rounded-full w-16`}
                  />
                )}
              </div>
            </Link>
          ))}
          <Image
            src="/profile-placeholder.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
