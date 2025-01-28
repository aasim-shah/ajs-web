"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import JobListings from './JobListings';
import SkeletonJobCard from './SkeletonJobCard';
import HeroComponent from "@/components/repeatComponents/Hero";
import PaginationComponent from './Pagination';
import { RootState, AppDispatch } from '@/store';
import { fetchBestMatchedJobs, setCurrentPage } from '@/store/slices/jobSlice';
import { updateJobPreference } from '@/store/slices/jobPreferenceSlice'; // Correct import statement
import { Job } from '@/store/slices/types'; // Ensure this import matches the Redux slice

const AllJobs: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<{ from: number; to: number } | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);
  const [careerLevel, setCareerLevel] = useState<string | null>(null);
  const [jobType, setJobType] = useState<string | null>(null);
  const [candidateType, setCandidateType] = useState<string | null>(null);
  const [location, setLocation] = useState<{ country: string; state: string; city: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const currentPage = useSelector((state: RootState) => state.job.currentPage);
  const jobs = useSelector((state: RootState) => state.job.bestMatchedJobs) as Job[];
  const loading = useSelector((state: RootState) => state.job.status === 'loading');
  const totalPages = useSelector((state: RootState) => state.job.totalPages);
  const totalJobs = useSelector((state: RootState) => state.job.totalJobs);

  useEffect(() => {
    const jobSeekerId = localStorage.getItem('_id'); // Assuming _id is stored in localStorage
    if (jobSeekerId) {
      dispatch(fetchBestMatchedJobs(jobSeekerId));
    }
  }, [dispatch, currentPage]);

  const handleCheckboxChange = (filter: string) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
    dispatch(setCurrentPage(1)); // Reset to first page on filter change
  };

  const handleSearch = (searchTerm: string, location: { country: string; state: string; city: string }) => {
    setSearchTerm(searchTerm);
    setLocation(location);
    dispatch(setCurrentPage(1)); // Reset to first page on new search
    // Update preferences in the backend
    dispatch(updateJobPreference({ locations: [location] }));
  };

  const handleSalaryChange = (from: number, to: number) => {
    setSalaryRange({ from, to });
    dispatch(setCurrentPage(1)); // Reset to the first page on filter change
    // Update preferences in the backend
    dispatch(updateJobPreference({ salary: { from, to } }));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.some(filter => {
      return job.skills.includes(filter) || job.jobType.includes(filter) || job.company.sector.includes(filter) || job.careerLevel.includes(filter) || job.candidateType.includes(filter);
    });

    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(job.company.sector);
    const matchesSalary = salaryRange ? job.salary.from >= salaryRange.from && job.salary.to <= salaryRange.to : true;
    const matchesAvailability = availability ? job.availability === availability : true;
    const matchesCareerLevel = careerLevel ? job.careerLevel === careerLevel : true;
    const matchesJobType = jobType ? job.jobType === jobType : true;
    const matchesCandidateType = candidateType ? job.candidateType === candidateType : true;
    const matchesLocation = location
      ? (location.city ? job.city.toLowerCase().includes(location.city.toLowerCase()) : true) &&
        (location.state ? job.province.toLowerCase().includes(location.state.toLowerCase()) : true) &&
        (location.country ? job.country.toLowerCase().includes(location.country.toLowerCase()) : true)
      : true;

    return (
      matchesFilters &&
      matchesSector &&
      matchesSalary &&
      matchesAvailability &&
      matchesCareerLevel &&
      matchesJobType &&
      matchesCandidateType &&
      matchesLocation
    );
  }).sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort jobs to show the latest first

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  return (
    <div>
      <div className='bg-muted md:pb-10'>
        <HeroComponent
          title="Best Matched Jobs!"
          titleClassName="text-3xl md:text-7xl md:pt-8 text-center font-bold text-darkGrey"
          spanClassName="text-signature"
          showSuggestions={false}
          backgroundImage="url-to-image"
          showSearchBar={false}
          onSearch={(term) => handleSearch(term, { country: '', state: '', city: '' })} // Update this line if needed
        />
      </div>
      <div className="md:container md:mt-16 pb-10 mt-4 md:flex gap-5">
        <Sidebar
          onCheckboxChange={handleCheckboxChange}
          selectedFilters={selectedFilters}
        />
        <div className="w-full">
          {loading ? (
            // Render skeleton loaders while jobs are loading
            Array.from({ length: 10 }).map((_, index) => <SkeletonJobCard key={index} />)
          ) : filteredJobs.length > 0 ? (
            <>
              <JobListings jobs={filteredJobs} totalJobs={filteredJobs.length} origin="yourOriginValue" />
              {filteredJobs.length >= 9 && (
                <PaginationComponent
                  jobsPerPage={10}
                  totalJobs={totalJobs}
                  paginate={paginate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <p>No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
