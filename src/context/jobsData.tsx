"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the Tab type
type Tab = string;

interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

interface JobsDataContextType {
  activeTab: string;
  changeTab: (tab: Tab) => void;
  page: number;
  changePage: (page: number) => void;
  pagination: Pagination;
  changePagination: (pagination: Pagination) => void;
}

const JobsDataContext = createContext<JobsDataContextType | undefined>(
  undefined
);

export const JobsDataProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>({
    totalPages: 2,
    currentPage: 1,
    hasNextPage: true,
    hasPreviousPage: true,
    nextPage: null,
    previousPage: null,
  });

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const changePage = (page: number) => {
    setPage(page);
  };

  const changePagination = (pagination: Pagination) => {
    setPagination(pagination);
  };

  return (
    <JobsDataContext.Provider
      value={{
        activeTab,
        changeTab,
        page,
        changePage,
        pagination,
        changePagination,
      }}
    >
      {children}
    </JobsDataContext.Provider>
  );
};

export const useJobsData = () => {
  const context = useContext(JobsDataContext);
  if (context === undefined) {
    throw new Error("useJobsData must be used within a JobsDataProvider");
  }
  return context;
};
