"use client";
import React, { useEffect, useState } from "react";
import useSearchingCategoriesList from "@/app/hooks/useSearchingCategoriesList";

const CategoryListSidebar = () => {
  const lists = useSearchingCategoriesList();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 1 }
    );

    lists.forEach((item) => {
      const section = document.getElementById(item.label.toLowerCase());
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [lists]);

  const handleScrollTo = (label: string) => {
    const element = document.getElementById(label.toLowerCase());
    if (element) {
      const headerOffset = 97;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  return (
    <aside className="w-1/4 bg-white border border-[#DADEE2] rounded-lg shadow-sm h-fit sticky top-20">
      <div className="flex flex-col py-4 px-3">
        <p className="text-lg font-semibold pb-3">On this page</p>

        {lists.map((item, index) => (
          <button
            key={index}
            onClick={() => handleScrollTo(item.label)}
            className={`text-sm mb-4 text-left transition-all px-4  ${
              activeSection === item.label.toLowerCase()
                ? "border-l-2 border-blue-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="px-4 -mt-5 pb-4"></div>
    </aside>
  );
};

export default CategoryListSidebar;
