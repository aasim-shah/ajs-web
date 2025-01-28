"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import JobListings from "./JobListings";
import SkeletonJobCard from "./SkeletonJobCard";
import HeroComponent from "../../../../components/repeatComponents/Hero";
import PaginationComponent from "./Pagination";
import { RootState, AppDispatch } from "../../../../store";
import { useTabsAndPagination } from "@/context/tabsAndPagination";
import useApi from "@/hooks/useApi";
import { getSavedJobs } from "@/api/jobs";

const SavedJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobSeekerId =
    useSelector((state: RootState) => state.auth.jobSeekerId) ||
    (typeof window !== "undefined" && localStorage.getItem("_id")) ||
    null;

  const { page, changePage, pagination, changePagination } =
    useTabsAndPagination();
  const { data, loading, error, execute } = useApi(getSavedJobs);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (jobSeekerId) {
        await execute(jobSeekerId, page);
      }
    };
    fetchSavedJobs();
  }, [jobSeekerId, page, execute]);

  useEffect(() => {
    if (data) {
      changePagination(data.pagination);
    }
  }, [data, changePagination]);

  return (
    <div>
      <div className="bg-muted md:pb-10">
        <HeroComponent
          title="Your Saved Jobs"
          titleClassName="text-3xl md:text-7xl md:pt-8 text-center font-bold text-darkGrey"
          spanClassName="text-signature"
          showSuggestions={false}
          backgroundImage="url-to-image"
          showSearchBar={false}
        />
      </div>
      <div className="md:container md:mt-16 pb-10 mt-4 md:flex gap-5">
        <div className="w-full">
          {loading ? (
            <SkeletonJobCard />
          ) : error ? (
            <p className="text-center text-lg mt-4 text-red-500">{error}</p>
          ) : data?.length === 0 ? (
            <p className="text-center text-lg mt-4">No saved jobs found.</p>
          ) : (
            <>
              {data && (
                <>
                  <JobListings
                    jobs={data?.jobs || []} // Fallback to an empty array if data is undefined
                    totalJobs={data?.jobs.length || 0} // Adjust this to access the total count properly
                    origin="savedJobs"
                  />
                  <PaginationComponent
                    page={page}
                    pagination={pagination}
                    changePage={changePage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
