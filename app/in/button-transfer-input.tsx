import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
import { MdAdd } from "react-icons/md";

interface ButtonTransferInputProps {
  title: string;
  data: string[];
  setData: (data: string[]) => void;
  isAdding: boolean;
  setIsAdding: (isTitleAdding: boolean) => void;
  newValue: string;
  setNewValue: (newTitle: string) => void;
  handleFunction: () => void;
}

const ButtonTransferInput = ({
  data,
  title,
  setData,
  isAdding,
  setIsAdding,
  newValue,
  setNewValue,
  handleFunction,
}: ButtonTransferInputProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex flex-wrap">
        {data.length > 0 &&
          data.map((dataItem, index) => (
            <Button
              onClick={() => setData(data.filter((item) => item !== dataItem))}
              key={index}
              className="mb-3 mr-3 flex w-fit space-x-1 rounded-full bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
            >
              <p className="text-sm font-medium">{dataItem}</p>
              <X className="size-5" />
            </Button>
          ))}
      </div>
      {isAdding ? (
        <div className="flex w-full items-center justify-between">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full border-2 px-2 py-1 text-sm"
            placeholder="Enter job title"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFunction();
              }
            }}
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          className="flex w-fit space-x-1 rounded-full border-2 border-blue-500 bg-white text-blue-500 hover:border-blue-700 hover:bg-blue-100"
        >
          <p className="text-sm font-medium">Add title</p>
          <MdAdd className="size-5" />
        </Button>
      )}
    </div>
  );
};

export default ButtonTransferInput;
