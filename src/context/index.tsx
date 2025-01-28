import { TimeFilterProvider } from "./TimeFilterProvider";
import { CommonDataProvider } from "./commonData";
import { JobsDataProvider } from "./jobsData";
import { TabsAndPaginationProvider } from "./tabsAndPagination";

const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TimeFilterProvider>
      <JobsDataProvider>
        <TabsAndPaginationProvider>
          <CommonDataProvider>{children} </CommonDataProvider>
        </TabsAndPaginationProvider>
      </JobsDataProvider>
    </TimeFilterProvider>
  );
};

export default AppDataProvider;
