"use client";
import Image from "next/image";
import Link from "next/link";
import InLogo from "@/app/assets/In-logo.jpg";
import { IoSearchSharp } from "react-icons/io5";
import useRoutes from "../hooks/useRoutes";
import { useCallback, useEffect, useRef, useState } from "react";

interface HeaderProps {
  isSearchFocus?: boolean;
  setIsSearchFocus?: (isSearchFocus: boolean) => void;
}

const Header = ({ isSearchFocus, setIsSearchFocus }: HeaderProps) => {
  const routes = useRoutes();
  const [underlineWidths, setUnderlineWidths] = useState(
    new Array(routes.length).fill(0)
  );

  const headerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!routes[index].active) {
        setUnderlineWidths((prevWidths) =>
          prevWidths.map((width, i) => (i === index ? 35 : width))
        );
      }
    },
    [routes]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      if (!routes[index].active) {
        setUnderlineWidths((prevWidths) =>
          prevWidths.map((width, i) => (i === index ? 0 : width))
        );
      }
    },
    [routes]
  );

  useEffect(() => {
    if (headerRef.current) {
      const links = headerRef.current.querySelectorAll(".link");
      links.forEach((link, index) => {
        link.addEventListener("mouseenter", () => handleMouseEnter(index));
        link.addEventListener("mouseleave", () => handleMouseLeave(index));
      });

      // Clean up event listeners when the component is unmounted
      return () => {
        links.forEach((link, index) => {
          link.removeEventListener("mouseenter", () => handleMouseEnter(index));
          link.removeEventListener("mouseleave", () => handleMouseLeave(index));
        });
      };
    }
  }, [headerRef, routes, underlineWidths, handleMouseEnter, handleMouseLeave]);
  return (
    <div
      ref={headerRef}
      className="w-full bg-white border-b-[1.5px] border-black  shadow-sm flex justify-around items-center z-30 sticky top-0"
    >
      <div className="flex items-center">
        <Image src={InLogo} alt="LinkedIn Logo" className="w-16 h-fit" />
        <div
          className={`flex items-center relative bg-[#EDF3F8] px-2 rounded-lg ${
            isSearchFocus ? "border-black border-2" : ""
          }`}
        >
          <IoSearchSharp
            size={20}
            className="text-gray-500 mr-2 transition-all duration-300"
          />
          <input
            type="text"
            placeholder="Search"
            className={`bg-transparent py-2 px-2  focus:outline-none transition-all duration-300 ${
              isSearchFocus ? "w-80" : "w-40"
            }`}
            onFocus={() => setIsSearchFocus!(true)}
            onBlur={() => setIsSearchFocus!(false)}
          />
        </div>
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
              <p className={`text-xs ${route.active ? "text-[#0A66C2]" : ""}`}>
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
  );
};

export default Header;
