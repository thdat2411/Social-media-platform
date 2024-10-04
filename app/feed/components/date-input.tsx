import React, { useEffect, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  date: string;
  setDate: (value: string) => void;
}

const DateInput = ({ date, setDate }: DateInputProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        setStartDate(date);
        setDate(date.toLocaleDateString());
        setCalendarVisible(false);
      }
    },
    [setDate]
  );

  const handleInputClick = () => {
    setCalendarVisible((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setCalendarVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative">
      <input
        type="text"
        value={date ?? ""}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className={`w-full border-2 rounded p-2 hover:border-2 hover:border-black ${
          calendarVisible ? "border-black" : "border-gray-400"
        }`}
        placeholder="Select a date"
        readOnly
        ref={inputRef}
      />
      {calendarVisible && (
        <div className="absolute z-10" ref={calendarRef}>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            inline
            className="bg-white border border-black rounded"
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
