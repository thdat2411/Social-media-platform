import { Button } from "@/components/ui/button";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

interface TypeSelectionProps {
  title: string;
  types: string[];
  values: string[];
  handleFunction: (value: string) => void;
}

const TypeSelection = ({
  title,
  types,
  values,
  handleFunction,
}: TypeSelectionProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex space-x-2">
        <div className="flex flex-wrap">
          {values.map((type, index) => (
            <Button
              onClick={() => handleFunction(type)}
              variant="outline"
              key={index}
              className={`rounded-full space-x-1 mr-3 mb-3 ${
                types.includes(type)
                  ? "bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
                  : "border-2 border-[#ACACAC] hover:border-[#878787]"
              }`}
            >
              <p className="text-sm font-medium">{type}</p>
              {types.includes(type) ? (
                <FaCheck className="size-4" />
              ) : (
                <MdAdd className="size-5" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeSelection;
