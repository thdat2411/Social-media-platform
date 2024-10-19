import { Clock } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
        className={`flex cursor-pointer items-center rounded border-2 p-1 ${
          isDropdownVisible ? "border-black" : "border-gray-400"
        }`}
        onClick={() => setDropdownVisible((prev) => !prev)}
      >
        <input
          type="text"
          value={selectedTime}
          readOnly
          className="w-full rounded border-none focus:outline-none"
          placeholder="Select time"
        />
        <Clock size={24} className="ml-2" />
      </div>
      {isDropdownVisible && (
        <div className="absolute z-10 max-h-[150px] w-full overflow-y-auto rounded border border-black bg-white shadow-lg">
          {timeSlots.map((time, index) => (
            <div
              key={index}
              onClick={() => handleTimeSelect(time)}
              className="cursor-pointer p-2 hover:bg-gray-200"
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
