"use client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  isEditing: boolean;
  onEdit: (value: string | null) => void;
}

const EditableField = ({
  label,
  value,
  setValue,
  isEditing,
  onEdit,
}: EditableFieldProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setInputValue(value); // Reset to the current value when editing starts
      setError(""); // Clear any previous errors
      inputRef.current?.focus();
    }
  }, [isEditing, value]);
  const validateInput = (value: string) => {
    if (label.includes("Phone") && !/^\d*$/.test(value)) {
      setError("Phone number must contain only digits.");
      return false;
    }
    if (label.includes("Full name") && /\d/.test(value)) {
      setError("Full name must not contain digits.");
      return false;
    }
    setError("");
    return true;
  };
  const handleSave = () => {
    if (validateInput(inputValue)) {
      setValue(inputValue);
      onEdit(null);
    }
  };
  return (
    <>
      <div className="flex w-full justify-between px-4 py-2 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs w-[210px]">{label}</p>
          {isEditing ? (
            <div className="flex items-center space-x-4 ">
              <div className="flex flex-col space-y-1">
                <input
                  ref={inputRef}
                  type={label.includes("phone") ? "tel" : "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`text-base border rounded-lg p-2 w-[300px] ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
              <div className="flex w-full items-center space-x-4">
                <Button
                  onClick={() => {
                    setInputValue(value); // Reset input to original value
                    onEdit(null); // Close editing
                  }}
                  variant="outline"
                  className="w-1/2 hover:bg-blue-600 hover:text-white h-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="w-1/2 hover:bg-blue-600 hover:text-white h-8 "
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base">
              {inputValue === "" || inputValue === null
                ? "(Not set)"
                : inputValue}
            </p>
          )}
        </div>
        {!isEditing && (
          <Button
            onClick={() => onEdit(label.toLowerCase())}
            variant="ghost"
            className="rounded-lg p-3"
          >
            <Pencil className="size-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default EditableField;
