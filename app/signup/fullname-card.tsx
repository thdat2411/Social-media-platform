import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface FullNameCardProps {
  data: user | null;
  setData: (data: user | null) => void;
  handleNext: () => void;
}

const FullNameCard = ({ data, setData, handleNext }: FullNameCardProps) => {
  const [firstName, setFirstName] = useState(
    data?.full_name?.split(" ")[0] ?? ""
  );
  const [lastName, setLastName] = useState(
    data?.full_name?.split(" ").slice(1).join(" ") ?? ""
  );

  const [isEnableToSubmit, setIsEnableToSubmit] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isEnableToSubmit) {
        handleSubmit();
      }
    }
  };
  const handleSubmit = () => {
    const updatedData = {
      ...data!,
      full_name: `${firstName} ${lastName}`,
    };

    setData(updatedData);
    handleNext();
  };

  useEffect(() => {
    if (firstName !== "" && lastName !== "") {
      setIsEnableToSubmit(true);
    } else {
      setIsEnableToSubmit(false);
    }
  }, [firstName, lastName]);

  return (
    <>
      <div
        className="flex flex-grow flex-col justify-around"
        onKeyDown={handleKeyDown}
      >
        <p className="text-3xl font-medium">Let me know your name</p>
        <div className="flex flex-col space-y-4">
          <p className="text-xl font-medium">First name</p>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-12 rounded border border-gray-300 px-4 py-2 text-lg"
            type="text"
            required
          />
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-xl font-medium">Last name</p>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-12 rounded border border-gray-300 px-4 py-2 text-lg"
            type="text"
            required
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!firstName || !lastName}
          className="w-fit self-end bg-blue-500 hover:bg-blue-700"
        >
          <p className="text-lg">Next</p>
        </Button>
      </div>
    </>
  );
};

export default FullNameCard;
