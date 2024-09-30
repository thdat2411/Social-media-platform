import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock4, Search } from "lucide-react";
import React from "react";
import { set } from "react-datepicker/dist/date_utils";

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
          <div className="flex justify-between items-center">
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
              className="flex w-full justify-start items-center mb-2"
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
                className="flex w-full justify-start items-center mb-2"
              >
                <Search size={16} className="mr-2" />
                <span>{item}</span>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 p-2 items-center rounded-full"
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
              className="flex w-full justify-start items-center mb-2"
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
