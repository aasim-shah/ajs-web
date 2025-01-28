"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JobListings from './JobListings';
import SkeletonJobCard from './SkeletonJobCard';
import HeroComponent from '@/components/repeatComponents/Hero';
import PaginationComponent from './Pagination';
import { RootState, AppDispatch } from '@/store';
import { getDeclinedJobs } from '@/store/slices/rejectedSlice';
 
 

const AllJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const accessToken = useSelector((state: RootState) => state.auth.accessToken) || (typeof window !== 'undefined' && localStorage.getItem('accessToken')) || null;
  const jobSeekerId = useSelector((state: RootState) => state.auth.jobSeekerId) || (typeof window !== 'undefined' && localStorage.getItem('_id')) || null;
  const declinedJobs = useSelector((state: RootState) => state.rejectedSlice.declinedJobs) || [];
  const declinedJobsStatus = useSelector((state: RootState) => state.rejectedSlice.status);
  const declinedJobsError = useSelector((state: RootState) => state.rejectedSlice.error);


  
  useEffect(() => {
    if (jobSeekerId && accessToken) {
     
      dispatch(getDeclinedJobs({ jobSeekerId }));
    }
  }, [dispatch, jobSeekerId, accessToken]);
  

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = Array.isArray(declinedJobs) ? declinedJobs.slice(indexOfFirstJob, indexOfLastJob) : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (declinedJobsStatus === 'loading' && !declinedJobs.length) {
    return (
      <>
        {Array.from({ length: jobsPerPage }).map((_, index) => (
          <SkeletonJobCard key={index} />
        ))}
      </>
    );
  }

  if (declinedJobsStatus === 'failed') {
    return <p className="text-center text-lg mt-4 text-red-500">{declinedJobsError}</p>;
  }

  return (
    <div>
      <div className="md:container md:mt-16 pb-10 mt-4 md:flex gap-5">
        <div className="w-full">
          {declinedJobs.length === 0 ? (
            <p className="text-center text-lg mt-4">No declined jobs found.</p>
          ) : (
            <>
              <JobListings jobs={currentJobs} totalJobs={declinedJobs.length} />
              <PaginationComponent
                jobsPerPage={jobsPerPage}
                totalJobs={declinedJobs.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
