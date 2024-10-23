"use client";
import InLogo from "@/app/assets/In-logo.jpg";
import { Button } from "@/components/ui/button";
import { Clock4, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useRoutes from "../hooks/useRoutes";
import ConfirmModal from "./confirm-modal";
import SearchDropDown from "./search-dropdown";
import UserDropdown from "./user-dropdown";
import { user } from "@prisma/client";

interface HeaderProps {
  user: user;
}

const Header = ({ user }: HeaderProps) => {
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
  const router = useRouter();
  const pathname = usePathname();
  const [isJobsPage, setIsJobsPage] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
    return setIsJobsPage(
      pathname !== null && /\/jobs(\/search)?(\/.*)?/.test(pathname)
    );
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        className="w-full bg-white border-b-[1.5px] border-black  shadow-sm flex justify-around max-[700px]:justify-start items-center z-30 sticky top-0"
      >
        <div className="flex items-center max-[700px]:w-full ">
          <Image
            onClick={() => {
              router.push("/feed");
            }}
            src={InLogo}
            alt="LinkedIn Logo"
            className="w-16 h-fit cursor-pointer"
          />
          <div className="max-[700px]:flex-1">
            <div
              className={`flex items-center relative bg-[#EDF3F8] px-2 rounded-lg mr-2   ${
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
                className={`bg-transparent text-sm py-2 px-2  focus:outline-none ${
                  isJobSearchFocus && !isJobsPage
                    ? "transition-all duration-300 w-80  "
                    : !isJobSearchFocus && !isJobsPage
                    ? "transition-all duration-300 w-44 "
                    : " w-44"
                }`}
                onChange={(e) => setJobSearchValue(e.target.value)}
                onFocus={() => setIsJobSearchFocus!(true)}
                onBlur={handleSearchJobBlur}
                onClick={(e) => e.stopPropagation()}
              />
              {isJobSearchFocus && (
                <div
                  className="absolute top-12 left-0 max-[400px]:-left-5 w-96 max-[700px]:w-full max-[700px]:overflow-auto  bg-white border border-gray-300 rounded-md shadow-lg"
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
                className="bg-transparent text-sm py-2 px-2 w-40 max-[700px]:w-full focus:outline-none"
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
        {!isMobile && (
          <div className="flex items-center space-x-10 text-gray-600 ">
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
                    className={`text-xs ${
                      route.active ? "text-[#0A66C2]" : ""
                    }`}
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
            <UserDropdown user={user} />
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
