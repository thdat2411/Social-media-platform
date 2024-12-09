"use client";
import InLogo from "@/app/assets/In-logo.jpg";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { search_history, user } from "@prisma/client";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock4, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useNotification } from "../context/NoftificationContext";
import useRoutes from "../hooks/useRoutes";
import HoverableIcon from "./hoverable-icon";

const ConfirmModal = dynamic(() => import("./confirm-modal"), { ssr: false });
const SearchDropDown = dynamic(() => import("./search-dropdown"), {
  ssr: false,
});
const UserDropdown = dynamic(() => import("./user-dropdown"), { ssr: false });

const Header = () => {
  const session = useSession();
  const [user, setUser] = useState<user | null>(null);
  const [isJobSearchFocus, setIsJobSearchFocus] = useState(false);
  const [isLocationSearchFocus, setIsLocationSearchFocus] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [jobSearchValue, setJobSearchValue] = useState("");
  const [locationValue, setLocationValue] = useState("Vietnam");
  const [recentItem, setRecentItem] = useState<search_history[]>([]);
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
  const { notificationCount, setNotificationCount, isNewPost, setIsNewPost } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  // const { pusher, bindEvent, unbindEvent } = usePusher();

  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (session.data) {
      const fetchUser = async () => {
        setIsLoading(true);
        const reponse = await axios.get("/api/user/get-current-user");
        const data = await reponse.data;
        setUser(data.user);
        setIsLoading(false);
      };
      fetchUser();
    }
  }, [session.data?.user]);
  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (session.data) {
      const fetchHistorySearchRecent = async () => {
        setIsLoading(true);
        const response = await axios.get("/api/history");
        const data = await response.data;
        setRecentItem(data.userHistory);
        setIsLoading(false);
      };
      fetchHistorySearchRecent();
    }
  }, [session.data?.user]);
  /*-----------------------------------------------------------*/
  const handleSearchSubmit = async () => {
    if (jobSearchValue) {
      const response = await axios.post(
        `/api/history?keyword=${jobSearchValue}`
      );

      if (response.status === 200) {
        router.push(`/search?keyword=${jobSearchValue}`);
      }
    }
    setIsJobSearchFocus(false);
  };
  /*-----------------------------------------------------------*/
  const handleConfirmModal = async () => {
    await axios.delete("/api/history").then((res) => {
      if (res.status === 200) {
        setRecentItem([]);
        setIsConfirmModalOpen(false);
      }
    });
  };
  /*-----------------------------------------------------------*/
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
  /*-----------------------------------------------------------*/
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
  /*-----------------------------------------------------------*/
  const handleSearchJobBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget && e.relatedTarget.tagName === "BUTTON") {
      return;
    }
    setIsJobSearchFocus!(false);
    setIsSeeAll(false);
  };
  /*-----------------------------------------------------------*/
  useEffect(() => {
    return setIsJobsPage(
      pathname !== null && /\/jobs(\/search)?(\/.*)?/.test(pathname)
    );
  }, [pathname]);
  /*-----------------------------------------------------------*/
  useEffect(() => {
    let mediaQueryList;
    if (isJobSearchFocus) {
      mediaQueryList = window.matchMedia("(max-width: 900px)");
    } else {
      mediaQueryList = window.matchMedia("(max-width: 1200px)");
    }

    interface MediaQueryChangeEvent {
      matches: boolean;
    }

    const handleMediaQueryChange = (event: MediaQueryChangeEvent) => {
      setIsMobile(event.matches);
    };

    // Set the initial state based on the current media query
    setIsMobile(mediaQueryList.matches);

    // Add event listener
    mediaQueryList.addEventListener("change", handleMediaQueryChange);

    return () => {
      // Cleanup the event listener
      mediaQueryList.removeEventListener("change", handleMediaQueryChange);
    };
  }, [isJobSearchFocus, isMobile]);
  /*-----------------------------------------------------------*/
  // useEffect(() => {
  //   if (session.data?.user) {
  //     if (pusher) {
  //       const handleNewNotification = () => {
  //         setNotificationCount((prev) => prev + 1);
  //       };
  //       const handleNewPost = () => {
  //         setIsNewPost(true);
  //       };
  //       bindEvent("new-notification", handleNewNotification);
  //       bindEvent("new-post", handleNewPost);

  //       return () => {
  //         unbindEvent("new-notification");
  //       };
  //     }
  //   }
  // }, [
  //   pusher,
  //   session.data?.user,
  //   bindEvent,
  //   setNotificationCount,
  //   unbindEvent,
  // ]);
  /*-----------------------------------------------------------*/
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "hidden") {
  //       setIsJobSearchFocus(false);
  //       setIsSeeAll(false);
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);
  /*-----------------------------------------------------------*/

  if (!session.data || !user || isLoading) {
    return null;
  } else {
    if (isLoading) {
      return (
        <div className="flex w-full items-center justify-around border-slate-300 bg-white shadow-sm max-[700px]:justify-start">
          <div className="flex items-center space-x-4 py-2 opacity-100 transition-opacity duration-1000 max-[700px]:w-full">
            <Skeleton className="size-10 rounded-lg bg-slate-300" />
            <Skeleton className="h-9 w-60 bg-slate-300" />
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <Skeleton className="h-9 w-[500px] rounded-lg bg-slate-300" />
            <Skeleton className="size-12 rounded-full bg-slate-300" />
          </div>
        </div>
      );
    } else {
      return (
        <>
          {(isJobSearchFocus || isLocationSearchFocus) && (
            <div className="fixed inset-0 z-10 bg-slate-900 bg-opacity-30" />
          )}
          <ConfirmModal
            open={isConfirmModalOpen}
            setOpen={setIsConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={() => handleConfirmModal()}
            title="Clear search history"
            content="Your search history is only visible to you, and it helps us to show you better results. Are you sure you want to clear it?"
            cancelLabel="Cancel"
            confirmLabel="Clear history"
            width="600"
          />
          <div
            ref={headerRef}
            className="sticky top-0 z-30 flex w-full items-center justify-around border-b-[1.5px] border-slate-300 bg-white shadow-sm max-[700px]:justify-start"
          >
            <div className="flex items-center opacity-100 transition-opacity duration-1000 max-[700px]:w-full">
              <Image
                onClick={() => {
                  router.push("/feed");
                }}
                src={InLogo}
                alt="LinkedIn Logo"
                width={64}
                height={64}
                className="h-fit w-16 cursor-pointer"
                loading="lazy"
              />
              <div className="max-[700px]:flex-1">
                <div
                  className={`relative mr-2 flex items-center rounded-lg bg-[#EDF3F8] px-2 ${
                    isJobSearchFocus ? "border-2 border-black" : ""
                  }`}
                >
                  <IoSearchSharp
                    size={20}
                    className="text-gray-500 transition-all duration-300"
                  />
                  <input
                    id="jobsearch"
                    type="text"
                    value={jobSearchValue}
                    placeholder={`${
                      !isJobsPage ? "Search" : "Title, skills or company"
                    }`}
                    className={`bg-transparent px-2 py-2 text-sm focus:outline-none ${
                      isJobSearchFocus && !isJobsPage
                        ? "w-80 transition-all duration-300"
                        : !isJobSearchFocus && !isJobsPage
                          ? "w-44 transition-all duration-300"
                          : "w-44"
                    }`}
                    onChange={(e) => setJobSearchValue(e.target.value)}
                    onFocus={() => setIsJobSearchFocus!(true)}
                    onBlur={handleSearchJobBlur}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit();
                      }
                    }}
                  />

                  {isJobSearchFocus && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-12 w-96 rounded-md border border-gray-300 bg-white shadow-lg max-[700px]:w-full max-[700px]:overflow-auto max-[400px]:-left-5"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <SearchDropDown
                        recentItem={recentItem}
                        setRecentItem={setRecentItem}
                        setIsSeeAll={setIsSeeAll}
                        setIsConfirmModalOpen={setIsConfirmModalOpen}
                        setJobSearchValue={setJobSearchValue}
                        setIsSearchFocus={setIsJobSearchFocus!}
                        isSeeAll={isSeeAll}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
              {isJobsPage && (
                <div
                  className={`relative flex items-center rounded-lg bg-[#EDF3F8] px-2 ${
                    isLocationSearchFocus ? "border-2 border-black" : ""
                  }`}
                >
                  <MapPin size={20} className="text-gray-500" />
                  <input
                    id="location"
                    type="text"
                    value={locationValue}
                    placeholder="City, state or zip code"
                    className="w-40 bg-transparent px-2 py-2 text-sm focus:outline-none max-[700px]:w-full"
                    onChange={(e) => setLocationValue(e.target.value)}
                    onFocus={() => setIsLocationSearchFocus!(true)}
                    onBlur={() => setIsLocationSearchFocus!(false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {isLocationSearchFocus && locationValue !== "" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-12 w-96 rounded-md border border-gray-300 bg-white shadow-lg"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="space-y-3 p-4">
                        {recentItem.map((item, index) => (
                          <Button
                            onClick={() => {
                              setLocationValue(item.term);
                            }}
                            variant="ghost"
                            key={index}
                            className="mb-2 flex w-full items-center justify-start"
                          >
                            <Clock4 size={16} className="mr-2" />
                            <span>{item.term}</span>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            {!isMobile && (
              <div className="flex items-center space-x-10 text-gray-600">
                {routes.map(
                  (route, index) =>
                    ((route.label !== "Post a job" &&
                      user.role !== "recruiter") ||
                      user.role === "recruiter") && (
                      <Link
                        key={route.label}
                        href={route.href}
                        className={`link relative flex cursor-pointer flex-col items-center justify-center hover:text-[#0A66C2] ${
                          route.active ? "text-gray-800" : ""
                        } group`}
                        onMouseEnter={() => {
                          handleMouseEnter(index);
                          setHoveredRoute(route.label);
                        }}
                        onMouseLeave={() => {
                          handleMouseLeave(index);
                          setHoveredRoute(null);
                        }}
                        onClick={() => {
                          handleMouseLeave(index);
                          if (route.label === "Notifications") {
                            sessionStorage.setItem(
                              `notificationCount-${user.id}`,
                              "0"
                            );
                            setNotificationCount(0);
                          }
                          if (route.label === "Home") {
                            setIsNewPost(false);
                          }
                        }}
                      >
                        <div
                          className={`flex h-16 flex-col items-center justify-center ${
                            underlineWidths[index] > 0 ? "flex-grow" : ""
                          }`}
                        >
                          <HoverableIcon
                            iconHover={route.iconHover}
                            isHovered={hoveredRoute === route.label}
                            className="relative size-9"
                          />
                          {route.label === "Notifications" &&
                            notificationCount > 0 && (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs text-white">
                                {notificationCount}
                              </span>
                            )}
                          {route.label === "Home" && isNewPost && (
                            <span className="absolute -right-1 top-2 flex size-3 items-center justify-center rounded-full bg-red-400 text-xs text-white" />
                          )}
                          <p
                            className={`text-xs ${
                              route.active ? "font-medium text-[#0A66C2]" : ""
                            }`}
                          >
                            {route.label}
                          </p>

                          {!route.active ? (
                            <span
                              className={`absolute bottom-0 h-[2.5px] bg-[#0A66C2]`}
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
                              className={`absolute bottom-0 h-[2.5px] w-16 justify-between rounded-full bg-[#0A66C2]`}
                            />
                          )}
                        </div>
                      </Link>
                    )
                )}
                <UserDropdown user={user!} />
              </div>
            )}
          </div>
        </>
      );
    }
  }
};

export default Header;
