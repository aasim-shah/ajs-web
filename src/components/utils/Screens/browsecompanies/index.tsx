"use client";
import AllJobs from "./BrowseCompanies";
import withProtectedRoutes from "@/components/HOC/ProtectedRoutes";

const index = () => {
  return <AllJobs />;
};

export default withProtectedRoutes(index);
