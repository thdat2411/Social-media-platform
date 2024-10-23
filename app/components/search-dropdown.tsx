import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock4, Search } from "lucide-react";
import React from "react";

interface SearchDropDownProps {
  recentItem: string[];
  trysearchItem: string[];
  setIsSeeAll: (isSeeAll: boolean) => void;
  setIsConfirmModalOpen: (isConfirmModalOpen: boolean) => void;
  isSeeAll: boolean;
  setIsSearchFocus: (isSearchFocus: boolean) => void;
  setJobSearchValue: (value: string) => void;
}

const SearchDropDown = ({
  recentItem,
  trysearchItem,
  setIsSeeAll,
  setIsConfirmModalOpen,
  isSeeAll,
  setIsSearchFocus,
  setJobSearchValue,
}: SearchDropDownProps) => {
  return (
    <div className="p-4">
      {!isSeeAll ? (
        <>
          <div className="flex items-center justify-between overflow-hidden max-[700px]:overflow-auto">
            <span className="font-semibold">Recent searches</span>
            <Button
              onClick={() => {
                setIsSeeAll(true);
              }}
              variant="ghost"
            >
              See all
            </Button>
          </div>
          {recentItem.map((item, index) => (
            <Button
              onClick={() => setJobSearchValue(item)}
              key={index}
              variant="ghost"
              className="mb-2 flex w-full items-center justify-start"
            >
              <Clock4 size={16} className="mr-2" />
              <span>{item}</span>
            </Button>
          ))}
          <div className="mt-4 space-y-2">
            <span className="font-semibold">Try searching for</span>
            {trysearchItem.map((item, index) => (
              <Button
                onClick={() => setJobSearchValue(item)}
                key={index}
                variant="ghost"
                className="mb-2 flex w-full items-center justify-start"
              >
                <Search size={16} className="mr-2" />
                <span>{item}</span>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 items-center rounded-full p-2"
                onClick={() => setIsSeeAll(false)}
              >
                <ChevronLeft size={16} className="mr-2" />
              </Button>
              <span className="font-semibold">Recent</span>
            </div>
            <Button
              onClick={() => {
                setIsSeeAll(false);
                setIsConfirmModalOpen(true);
                setIsSearchFocus(false);
              }}
              variant="ghost"
            >
              Clear
            </Button>
          </div>
          {recentItem.map((item, index) => (
            <Button
              onClick={() => setJobSearchValue(item)}
              key={index}
              variant="ghost"
              className="mb-2 flex w-full items-center justify-start"
            >
              <Clock4 size={16} className="mr-2" />
              <span>{item}</span>
            </Button>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchDropDown;
