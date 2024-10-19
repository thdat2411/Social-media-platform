"use client";
import useSearchingCategoriesList from "@/app/hooks/useSearchingCategoriesList";
import React, { useEffect, useState } from "react";

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
      { threshold: 1 },
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
    <aside className="sticky top-20 h-fit w-1/4 rounded-lg border border-[#DADEE2] bg-white shadow-sm">
      <div className="flex flex-col px-3 py-4">
        <p className="pb-3 text-lg font-semibold">On this page</p>

        {lists.map(
          (item, index) =>
            item.label !== "All" && (
              <button
                key={index}
                onClick={() => handleScrollTo(item.label)}
                className={`mb-4 px-4 text-left text-sm transition-all ${
                  activeSection === item.label.toLowerCase()
                    ? "border-l-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {item.label}
              </button>
            ),
        )}
      </div>
      <div className="-mt-5 px-4 pb-4"></div>
    </aside>
  );
};

export default CategoryListSidebar;
