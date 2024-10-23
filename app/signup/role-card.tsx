import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface RoleCardProps {
  data: user | null;
  setData: (data: user | null) => void;
  handleNext: () => void;
}

const RoleCard = ({ data, setData, handleNext }: RoleCardProps) => {
  const [role, setRole] = useState(data?.role ?? "");
  const [isEnableToSubmit, setIsEnableToSubmit] = useState(false);

  useEffect(() => {
    if (role !== "") {
      setIsEnableToSubmit(true);
    } else {
      setIsEnableToSubmit(false);
    }
  }, [role]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isEnableToSubmit) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    setData({
      ...data!,
      role: role,
    });
    console.log(data);
    handleNext();
  };
  return (
    <>
      <div
        className="flex flex-col flex-grow justify-around"
        onKeyDown={handleKeyDown}
      >
        <p className="text-3xl font-medium">What is your purpose</p>
        <div className="flex space-x-6 items-center">
          <input
            onClick={() => setRole("recruiter")}
            className="border border-gray-300 rounded py-2 px-4 size-8"
            type="radio"
            checked={role === "recruiter"}
          />
          <div className="flex flex-col">
            <p className="text-lg font-medium">Recruiter</p>
            <p className="text-muted-foreground">
              Post a job to hire your suitable employees
            </p>
          </div>
        </div>
        <div className="flex space-x-6 items-center">
          <input
            onClick={() => setRole("jobseeker")}
            className="border border-gray-300 rounded py-2 px-4 size-8"
            type="radio"
            checked={role === "jobseeker"}
          />
          <div className="flex flex-col">
            <p className="text-lg font-medium">Job Seeker</p>
            <p className="text-muted-foreground">
              Find a job that suits your skills and experiences
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!role}
          className="bg-blue-500 hover:bg-blue-700 w-fit self-end"
        >
          <p className="text-lg">Next</p>
        </Button>
      </div>
    </>
  );
};

export default RoleCard;
