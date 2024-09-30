import { Clock } from "lucide-react";
import React, { useState, useMemo, useEffect, useRef } from "react";

interface TimeInputProps {
  selectedTime: string;
  setSelectedTime: (value: string) => void;
}

const TimeInput = ({ selectedTime, setSelectedTime }: TimeInputProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? "AM" : "PM";
        const timeString = `${formattedHour}:${
          minute === 0 ? "00" : minute
        } ${ampm}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setDropdownVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center border-2 rounded cursor-pointer p-1 ${
          isDropdownVisible ? "border-black" : "border-gray-400"
        }`}
        onClick={() => setDropdownVisible((prev) => !prev)}
      >
        <input
          type="text"
          value={selectedTime}
          readOnly
          className="w-full border-none rounded focus:outline-none"
          placeholder="Select time"
        />
        <Clock size={24} className="ml-2" />
      </div>
      {isDropdownVisible && (
        <div className="absolute z-10 w-full max-h-[150px] overflow-y-auto bg-white border border-black rounded shadow-lg">
          {timeSlots.map((time, index) => (
            <div
              key={index}
              onClick={() => handleTimeSelect(time)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeInput;
