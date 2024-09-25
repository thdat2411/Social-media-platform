import React from "react";
import JobContainer from "./job-container";

export type Lists = {
  label: string;
  hiringName: string;
  location: string;
  createdAt: string;
};

interface ContainerProps {
  label: string;
  lists: Lists[]; //Jobs[], People[], Posts[]
}

const Container = ({ label, lists }: ContainerProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border-[1.5px] border-[#DADEE2]">
      <div
        id={label.toLowerCase()}
        className="flex flex-col space-x-2 space-y-2"
      >
        <p className="font-semibold text-xl">{label}</p>
        <div className="flex flex-col w-full space-y-3">
          {lists.map((item, index) => (
            <JobContainer
              key={index}
              index={index}
              item={item}
              label={label}
              lists={lists}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Container;
