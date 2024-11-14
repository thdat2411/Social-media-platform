import locations from "@/app/utils/locations.json";
import occupations from "@/app/utils/occupations.json";
import { job_posting } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { capitalizeFirstLetter } from "../utils/utils";

interface InputSuggestionProps {
  formData: job_posting;
  setFormData: (value: job_posting) => void;
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  label: string;
  isError: boolean;
}

const InputSuggestion = ({
  formData,
  setFormData,
  isFocused,
  setIsFocused,
  label,
  isError,
}: InputSuggestionProps) => {
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(
    label === "Job title" ? formData.title || "" : formData.location || ""
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [titleQues, setTitleQues] = useState(false);

  const debouncedUpdateFormData = useCallback(
    (value: string) => {
      debounce(() => {
        if (label === "Job title") {
          setFormData({ ...formData, title: capitalizeFirstLetter(value) });
        } else if (label === "Location") {
          setFormData({ ...formData, location: capitalizeFirstLetter(value) });
        }
      }, 300)();
    },
    [label, formData, setFormData]
  );

  // useEffect(() => {
  //   const data = {
  //     title: "Software Engineer",
  //     company_name: "Google",
  //     location: "Mountain View, CA",
  //     workplaceType: "On-site",
  //     jobType: "Full-time",
  //     level: "Entry-level",
  //   };
  //   const fetchData = async () => {
  //     const response = await axios.post("/api/suggestion", data);
  //     const { description } = response.data;
  //     console.log(description);
  //   };
  //   fetchData();
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(capitalizeFirstLetter(value));
    debouncedUpdateFormData(value);

    if (label === "Job title") {
      // Simple suggestion for job titles
      const filteredSuggestions = occupations.title.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionList(filteredSuggestions);
    } else if (label === "Location") {
      updateLocationSuggestions(value);
    }
  };

  const updateLocationSuggestions = (value: string) => {
    if (selectedProvince) {
      // Filter locations within the selected province
      const provinceData = locations.Vietnam.find(
        (province) => province.province === selectedProvince
      );
      const filteredLocations = provinceData
        ? provinceData.locations.filter((location) =>
            location.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      setSuggestionList(filteredLocations);
    } else {
      // Show list of provinces if none selected
      const filteredProvinces = locations.Vietnam.map(
        (province) => province.province
      ).filter((province) =>
        province.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionList(filteredProvinces);
    }
  };

  useEffect(() => {
    // If input doesn't include the selected province, reset selection
    if (selectedProvince && !inputValue.startsWith(selectedProvince)) {
      setSelectedProvince(null);
      setSuggestionList(locations.Vietnam.map((province) => province.province));
    }
  }, [inputValue, selectedProvince]);

  const handleSuggestionClick = (value: string) => {
    setInputValue(value);
    debouncedUpdateFormData(value);
    setSuggestionList([]);
    setIsFocused(false);
  };

  const shouldShowDropdown =
    isFocused &&
    inputValue.trim() !== "" &&
    (suggestionList.length > 0 || selectedProvince === null);

  return (
    <div className="relative flex w-1/2 flex-col">
      <div className="flex items-center space-x-2">
        <p
          className={`max-[450px]:text-xs min-[450px]:text-sm ${
            isError ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {label}*
        </p>
        <div className="relative">
          <div
            onClick={() => setTitleQues(!titleQues)}
            className="cursor-pointer rounded-full p-2 hover:bg-slate-200"
          >
            <AiFillQuestionCircle className="size-5" />
          </div>
          <AnimatePresence>
            {titleQues && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className={`absolute left-10 z-10 flex ${label === "Job title" ? "-top-9 w-[350px]" : "-top-12 w-[290px]"} overflow-x-auto break-words rounded-lg border-2 bg-white p-4 text-sm shadow-lg`}
              >
                {label === "Job title" ? (
                  <p>
                    Make your job more discoverable to job seekers by selecting
                    a title from the dropdown. You can also choose your own
                    title instead.
                  </p>
                ) : (
                  <p>
                    Picking a specific city or metro area can help make your
                    on-site job more discoverable by job seekers in those areas,
                    while still remaining visible to everyone in your country or
                    region.
                  </p>
                )}
                <div
                  onClick={() => setTitleQues(false)}
                  className="h-fit cursor-pointer rounded-full p-2 hover:bg-slate-200"
                >
                  <X className="size-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <input
        id={label === "Job title" ? "job-title" : "location"}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 250)}
        className={`rounded-md p-2 max-[450px]:text-xs min-[450px]:text-sm ${
          isError ? "outline outline-2 outline-red-500" : "border border-black"
        }`}
        required
      />
      {shouldShowDropdown && suggestionList.length > 0 && (
        <ul
          className="absolute top-[65px] z-10 mt-2 max-h-32 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suggestionList.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer p-3 text-sm hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {capitalizeFirstLetter(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSuggestion;
