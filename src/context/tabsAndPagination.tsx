"use client";
import { initialPagination } from "@/utils/constants";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface TabsAndPaginationType {
  activeTab: string;
  changeTab: (tab: Tab) => void;
  page: number;
  changePage: (page: number) => void;
  pagination: Pagination;
  changePagination: (pagination: Pagination) => void;
}

const TabsAndPaginationContext = createContext<
  TabsAndPaginationType | undefined
>(undefined);

export const TabsAndPaginationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setPagination(initialPagination);
    setPage(1);
  };

  const changePage = (page: number) => {
    setPage(page);
  };

  const changePagination = useCallback((pagination: Pagination) => {
    setPagination(pagination);
  }, []);

  return (
    <TabsAndPaginationContext.Provider
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
    </TabsAndPaginationContext.Provider>
  );
};

export const useTabsAndPagination = () => {
  const context = useContext(TabsAndPaginationContext);
  if (context === undefined) {
    throw new Error(
      "useTabsAndPagination must be used within a TabsAndPaginationProvider"
    );
  }
  return context;
};
