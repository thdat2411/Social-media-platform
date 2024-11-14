import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import axios from "axios";
import { debounce } from "lodash";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import OccupationData from "../utils/occupations.json";
import { capitalizeFirstLetter } from "../utils/utils";

interface JobSeekerCardProps {
  userData: user | null;
}

const JobSeekerCard = ({ userData }: JobSeekerCardProps) => {
  const jobTitles = OccupationData.title;
  const router = useRouter();
  const [jobInputValue, setJobInputValue] = useState("");
  const [locationInputValue, setLocationInputValue] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isJobFocused, setIsJobFocused] = useState(false);
  const [prevJobSuggestions, setPrevJobSuggestions] = useState<string[]>([]);
  const [prevLocationSuggestions, setPrevLocationSuggestions] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  /*----------------------------------------------------------------------- */
  const fetchLocations = useCallback(async (keyword: string) => {
    if (!keyword) return;
    try {
      const formattedKeyword = keyword.split(" ").join("+");
      const response = await fetch(
        `http://api.geonames.org/searchJSON?q=${formattedKeyword}&country=VN&maxRows=20&username=thaidat`
      );
      const data = await response.json();
      const locationList = data.geonames.map(
        (location: { toponymName: string }) => location.toponymName
      );
      setLocations(locationList);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);
  /*----------------------------------------------------------------------- */
  const debouncedFetchLocations = useCallback(
    debounce((keyword: string) => fetchLocations(keyword), 300),
    [fetchLocations]
  );
  /*----------------------------------------------------------------------- */
  useEffect(() => {
    if (locationInputValue) {
      debouncedFetchLocations(locationInputValue);
    } else {
      setLocations([]);
    }
  }, [locationInputValue, debouncedFetchLocations]);
  /*----------------------------------------------------------------------- */
  const debouncedFilterSuggestions = debounce((value) => {
    if (!value) {
      setJobSuggestions([]);
      setLocationSuggestions([]);
      return;
    }
    if (isJobFocused) {
      const filteredTitles = jobTitles
        .filter((title) => title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 20);

      setJobSuggestions(filteredTitles);
    } else if (isLocationFocused) {
      setLocationSuggestions(locations);
    }
  }, 300);
  /*----------------------------------------------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobInputValue(value);
    debouncedFilterSuggestions(value);
  };
  /*----------------------------------------------------------------------- */
  const handleJobSuggestionClick = (title: string) => {
    setJobInputValue(capitalizeFirstLetter(title));
    setPrevJobSuggestions(jobSuggestions);
    setJobSuggestions([]);
    setIsJobFocused(false);
  };
  /*----------------------------------------------------------------------- */
  const handleLocationSuggestionClick = (location: string) => {
    setLocationInputValue(location);
    setPrevLocationSuggestions(locationSuggestions);
    setLocationSuggestions([]);
    setIsLocationFocused(false);
  };
  /*----------------------------------------------------------------------- */
  const handleBlur = (isJob: boolean) => {
    setTimeout(() => {
      if (isJob) {
        setIsJobFocused(false);
      } else {
        setIsLocationFocused(false);
      }
    }, 250);
  };
  /*----------------------------------------------------------------------- */
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInputValue(value);
    debouncedFilterSuggestions(value);
  };
  /*----------------------------------------------------------------------- */
  const handleDisableSubmit = (): boolean => {
    const isJobValid = prevJobSuggestions.includes(jobInputValue);
    const isLocationValid =
      prevLocationSuggestions.includes(locationInputValue);
    return !(
      (jobInputValue && locationInputValue && isJobValid && isLocationValid) ||
      isLoading
    );
  };
  /*----------------------------------------------------------------------- */
  const handleSumbit = async () => {
    try {
      setIsLoading(true);
      const userReponse = await axios.post("/api/register/user", userData);
      const jobSeekerData = {
        userId: userReponse.data.id,
        job_titles: [jobInputValue],
        location_on_site: locationInputValue,
      };
      const userLoginData = {
        email: userData?.email,
        password: userData?.password_hash,
      };
      await axios
        .post("/api/register/job-preference", jobSeekerData)
        .then(() => {
          signIn("credentials", {
            ...userLoginData,
            redirect: false,
          })
            .then((callback) => {
              if (callback?.error) {
                toast.error(callback.error);
              }
              if (callback?.ok && !callback.error) {
                router.push("/feed");
                toast.success("Logged in!");
                setIsLoading(false);
              }
            })
            .catch((error) => {
              console.error("Error signing in:", error);
            });
        });
    } catch (error) {
      console.error("Error submitting job preference:", error);
    }
  };
  /*----------------------------------------------------------------------- */
  return (
    <>
      <p className="text-3xl font-medium">
        Let me know your career expectation
      </p>
      <div className="relative flex flex-col">
        <p className="text-lg font-medium">
          What position do you want to find?
        </p>
        <input
          type="text"
          className="mt-2 h-12 rounded border border-gray-300 px-4 py-2 text-lg"
          value={jobInputValue}
          onChange={handleInputChange}
          onFocus={() => setIsJobFocused(true)}
          onBlur={() => handleBlur(true)}
        />
        {isJobFocused && jobSuggestions.length > 0 && (
          <ul
            className="absolute top-[80px] z-10 mt-2 max-h-32 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {jobSuggestions.map((title) => (
              <li
                key={title}
                className="cursor-pointer p-3 text-sm hover:bg-gray-200"
                onClick={() => handleJobSuggestionClick(title)}
              >
                {capitalizeFirstLetter(title)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative flex flex-col pb-6">
        <p className="text-lg font-medium">
          What location do you want to work?
        </p>
        <input
          type="text"
          className="mt-2 h-12 rounded border border-gray-300 px-4 py-2"
          value={locationInputValue}
          onChange={handleLocationChange}
          onFocus={() => setIsLocationFocused(true)}
          onBlur={() => handleBlur(false)}
        />
        {isLocationFocused && locationSuggestions.length > 0 && (
          <ul
            className="absolute top-[75px] z-10 mt-2 max-h-32 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {locationSuggestions.map((location, index) => (
              <li
                key={index}
                className="cursor-pointer p-3 text-sm hover:bg-gray-200"
                onClick={() => handleLocationSuggestionClick(location)}
              >
                {location}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
        onClick={handleSumbit}
        className="w-fit self-end bg-blue-500 hover:bg-blue-700"
        disabled={handleDisableSubmit()}
      >
        {isLoading ? (
          <span className="animate-spin">
            <Loader />
          </span>
        ) : (
          <span className="text-lg">Get started</span>
        )}
      </Button>
    </>
  );
};

export default JobSeekerCard;
