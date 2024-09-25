import React, { act } from "react";
import useSearchingCategoriesList from "../hooks/useSearchingCategoriesList";
import Container, { Lists } from "../components/container";
import { jobs } from "../utils/jobs";

const SearchMainContent = () => {
  const jobList: Lists[] = jobs;
  const lists = useSearchingCategoriesList();
  return (
    <div className="w-1/2 mx-4">
      {lists.map((item, index) => (
        <Container key={index} label={item.label} lists={jobList} />
      ))}
    </div>
  );
};

export default SearchMainContent;
