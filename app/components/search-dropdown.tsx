import { Button } from "@/components/ui/button";
import { search_history } from "@prisma/client";
import { ChevronLeft, Clock4 } from "lucide-react";
import React from "react";

interface SearchDropDownProps {
  recentItem: search_history[];
  setRecentItem: (item: search_history[]) => void;
  setIsSeeAll: (isSeeAll: boolean) => void;
  setIsConfirmModalOpen: (isConfirmModalOpen: boolean) => void;
  isSeeAll: boolean;
  setIsSearchFocus: (isSearchFocus: boolean) => void;
  setJobSearchValue: (value: string) => void;
}

const SearchDropDown = ({
  recentItem,
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
            {recentItem.length > 0 && (
              <Button
                onClick={() => {
                  setIsSeeAll(true);
                }}
                variant="ghost"
              >
                See all
              </Button>
            )}
          </div>
          {recentItem.length > 0 ? (
            recentItem.map((item, index) => (
              <Button
                onClick={() => setJobSearchValue(item.term)}
                key={index}
                variant="ghost"
                className="mb-2 flex w-full items-center justify-start"
              >
                <Clock4 size={16} className="mr-2" />
                <span>{item.term}</span>
              </Button>
            ))
          ) : (
            <div className="p-3 text-muted-foreground">No searching yet</div>
          )}
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
              onClick={() => setJobSearchValue(item.term)}
              key={index}
              variant="ghost"
              className="mb-2 flex w-full items-center justify-start"
            >
              <Clock4 size={16} className="mr-2" />
              <span>{item.term}</span>
            </Button>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchDropDown;
