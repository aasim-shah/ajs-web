"use client";
import React, { createContext, useContext, useState } from "react";

interface FiltersContextType {
  timeFilter: string;
  timeFrames: { name: string; value: string }[];
  changeTimeFilter: (timeFrame: string) => void;
}

const defaultFiltersContext: FiltersContextType = {
  timeFilter: "monthly",
  timeFrames: [
    {
      name: "Weekly",
      value: "weekly",
    },
    {
      name: "Monthly",
      value: "monthly",
    },
    {
      name: "Yearly",
      value: "yearly",
    },
    {
      name: "All Time",
      value: "allTime",
    },
  ],
  changeTimeFilter: () => {},
};

const FiltersContext = createContext<FiltersContextType>(defaultFiltersContext);

export const useTimeFilter = () => useContext(FiltersContext);

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timeFilter, setTimeFilter] = useState<string>("monthly");

  const changeTimeFilter = (timeFrame: string) => {
    setTimeFilter(timeFrame);
  };

  // Ensuring timeFilter is always one of the predefined values

  if (
    !defaultFiltersContext.timeFrames.some(
      (timeFrame) => timeFrame.value === timeFilter
    )
  ) {
    setTimeFilter(defaultFiltersContext.timeFilter);
  }

  const values = {
    timeFilter,
    timeFrames: defaultFiltersContext.timeFrames,
    changeTimeFilter,
  };

  return (
    <FiltersContext.Provider value={values}>{children}</FiltersContext.Provider>
  );
};
