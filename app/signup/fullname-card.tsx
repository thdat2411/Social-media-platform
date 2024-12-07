import { Button } from "@/components/ui/button";
import { user } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface FullNameCardProps {
  data: user | null;
  setData: (data: user | null) => void;
  handleNext: () => void;
}

const FullNameCard = ({ data, setData, handleNext }: FullNameCardProps) => {
  const [firstName, setFirstName] = useState(data?.name?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(
    data?.name?.split(" ").slice(1).join(" ") ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isEnableToSubmit, setIsEnableToSubmit] = useState(false);

  // Validation function
  const validateInput = (value: string): boolean => {
    const invalidPattern =
      /[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáạâậấềếệẹộọặắằợớờãèéêìíòóôõùúăđĩũơƯỨỪỬỰỄỆịọụỳỵỷỹ\s]/;
    return !invalidPattern.test(value); // Returns true if valid
  };

  const handleInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(value);
    if (!validateInput(value)) {
      setError("Names cannot contain numbers or special characters.");
    } else {
      setError(null);
    }
  };

  const handleSubmit = () => {
    const updatedData = {
      ...data!,
      name: `${firstName} ${lastName}`,
    };
    setData(updatedData);
    handleNext();
  };

  useEffect(() => {
    if (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      validateInput(firstName) &&
      validateInput(lastName)
    ) {
      setIsEnableToSubmit(true);
    } else {
      setIsEnableToSubmit(false);
    }
  }, [firstName, lastName]);

  return (
    <div className="flex flex-grow flex-col justify-around">
      <p className="text-3xl font-medium">Let me know your name</p>
      <div className="flex flex-col space-y-4">
        {error && <p className="text-sm font-medium text-red-500">*{error}</p>}
        <p className="text-xl font-medium">First name</p>
        <input
          value={firstName}
          onChange={(e) => handleInputChange(e.target.value, setFirstName)}
          className="h-12 rounded border border-gray-300 px-4 py-2 text-lg"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <p className="text-xl font-medium">Last name</p>
        <input
          value={lastName}
          onChange={(e) => handleInputChange(e.target.value, setLastName)}
          className="h-12 rounded border border-gray-300 px-4 py-2 text-lg"
          type="text"
          required
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isEnableToSubmit}
        className={`w-fit self-end ${
          isEnableToSubmit ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400"
        }`}
      >
        <p className="text-lg">Next</p>
      </Button>
    </div>
  );
};

export default FullNameCard;
