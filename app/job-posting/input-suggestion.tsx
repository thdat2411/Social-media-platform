import OccupationData from "@/app/utils/occupations.json";
import { job_posting } from "@prisma/client";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../utils/utils";

interface InputSuggestionProps {
  formData: job_posting;
  setFormData: (value: job_posting) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  label: string;
  isError: boolean;
}

const InputSugesstion = ({
  formData,
  setFormData,
  isFocused,
  setIsFocused,
  label,
  isError,
}: InputSuggestionProps) => {
  const [locations, setLocations] = useState<string[]>([]);
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const fetchLocations = async (keyword: string) => {
    try {
      const formattedKeyword = keyword.split(" ").join("+");
      const response = await fetch(
        `http://api.geonames.org/searchJSON?q=${formattedKeyword}&country=VN&maxRows=100&username=thaidat`
      );
      const data = await response.json();
      console.log(data);
      const locationList = data.geonames.map(
        (location: { toponymName: string }) => location.toponymName
      );
      setLocations(locationList);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  useEffect(() => {
    fetchLocations(formData?.location ?? "");
  }, [formData?.location]);

  const debouncedFilterSuggestions = debounce((value) => {
    if (!value) {
      setSuggestionList([]);
      return;
    }
    if (label === "Job title") {
      const jobTitles = OccupationData.titles;
      const filteredTitles = jobTitles
        .filter((title) => title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 200);
      setSuggestionList(filteredTitles);
    } else {
      setSuggestionList(locations);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (label === "Job title") {
      setFormData({ ...formData, title: capitalizeFirstLetter(value) });
    } else if (label === "Location") {
      setFormData({ ...formData, location: capitalizeFirstLetter(value) });
    } else {
      setFormData({ ...formData, company_name: capitalizeFirstLetter(value) });
    }
    debouncedFilterSuggestions(value);
  };

  const handleSuggestionClick = (titleValue: string) => {
    if (label === "Job title") {
      setFormData({ ...formData, title: capitalizeFirstLetter(titleValue) });
    } else if (label === "Location") {
      setFormData({ ...formData, location: capitalizeFirstLetter(titleValue) });
    } else {
      setFormData({
        ...formData,
        company_name: capitalizeFirstLetter(titleValue),
      });
    }
    setSuggestionList([]);
    setIsFocused(false);
  };
  return (
    <div className="relative flex w-1/2 flex-col space-y-2">
      <label
        className={`max-[450px]:text-xs min-[450px]:text-sm ${isError ? "text-red-500" : "text-muted-foreground"}`}
      >
        {label}*
      </label>
      <input
        type="text"
        value={
          label === "Job title"
            ? (formData?.title ?? "")
            : label === "Location"
              ? (formData?.location ?? "")
              : (formData?.company_name ?? "")
        }
        onChange={handleChange}
        onClick={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false);
          }, 100);
        }}
        className={`rounded-md p-2 max-[450px]:text-xs min-[450px]:text-sm ${isError ? "outline outline-2 outline-red-500" : "border border-black"}`}
        required
      />
      {isFocused && suggestionList.length > 0 && (
        <ul
          className="absolute top-[65px] z-10 mt-2 max-h-32 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suggestionList.map((title) => (
            <li
              key={title}
              className="cursor-pointer p-3 text-sm hover:bg-gray-200"
              onClick={() => handleSuggestionClick(title)}
            >
              {capitalizeFirstLetter(title)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSugesstion;
