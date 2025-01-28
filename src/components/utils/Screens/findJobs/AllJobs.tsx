import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import JobListings from './JobListings';
import SkeletonJobCard from './SkeletonJobCard';
import HeroComponent from "../../../../components/repeatComponents/Hero";
import PaginationComponent from './Pagination';
import { RootState, AppDispatch } from '@/store';
import { fetchJobs, setCurrentPage } from '@/store/slices/jobSlice';
import { fetchAppliedJobs } from '@/store/slices/jobSeekerSlice';
import { Job } from '@/store/slices/types';
 
const AllJobs: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const currentPage = useSelector((state: RootState) => state.job.currentPage);
  const jobs = useSelector((state: RootState) => state.job.jobs) as Job[];
  const loading = useSelector((state: RootState) => state.job.status === 'loading');
  const totalPages = useSelector((state: RootState) => state.job.totalPages);
  const totalJobs = useSelector((state: RootState) => state.job.totalJobs);
  const appliedJobs = useSelector((state: RootState) => state.jobSeeker.jobSeeker?.appliedJobs || []);

  useEffect(() => {
    const jobSeekerId = localStorage.getItem("_id");
    if (jobSeekerId) {
      dispatch(fetchAppliedJobs(jobSeekerId));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchJobs(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
   
  }, [appliedJobs]);

  const handleCheckboxChange = (filter: string) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
    dispatch(setCurrentPage(1)); // Reset to first page on filter change
  };

  const handleSearch = (searchTerm: string, location: string) => {
    setSearchTerm(searchTerm);
    setLocation(location);
    dispatch(setCurrentPage(1)); // Reset to first page on new search
  };

  const salaryRanges: { [key: string]: [number, number] } = {
    "15000-25000": [15000, 25000],
    "25000-35000": [25000, 35000],
    "35000-45000": [35000, 45000]
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.some(filter => {
      if (filter in salaryRanges) {
        const [minSalary, maxSalary] = salaryRanges[filter];
        return job.salary.from >= minSalary && job.salary.from <= maxSalary;
      } else {
        return (
          (job.skills && job.skills.includes(filter)) ||
          (job.jobType && job.jobType.includes(filter)) ||
          (job.company && job.company.sector && job.company.sector.includes(filter)) ||
          (job.careerLevel && job.careerLevel.includes(filter)) ||
          (job.candidateType && job.candidateType.includes(filter))
        );
      }
    });
  
    const matchesSearchTerm =
      searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company && job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
  
    const matchesLocation =
      location === '' ||
      job.city.toLowerCase().includes(location.toLowerCase()) ||
      job.province.toLowerCase().includes(location.toLowerCase()) ||
      job.country.toLowerCase().includes(location.toLowerCase());
  
    return matchesFilters && matchesSearchTerm && matchesLocation;
  }).sort((a: Job, b: Job) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Ensure latest jobs are shown first
  
  
  
  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  return (
    <div> 
      <div className='bg-muted md:pb-10'>
        <HeroComponent
          title="Find the best job!"
          titleClassName="text-3xl md:text-7xl md:pt-8 text-center font-bold text-darkGrey"
          spanClassName="text-signature"
          showSuggestions={true}
          backgroundImage="url-to-image"
          showSearchBar={true}
          onSearch={handleSearch}
        />
      </div>
      <div className="md:container md:mt-16 pb-10 mt-4 md:flex gap-5">
        <Sidebar onCheckboxChange={handleCheckboxChange} selectedFilters={selectedFilters} />
        <div className="w-full">
          {loading ? (
            // Render skeleton loaders
            Array.from({ length: 10 }).map((_, index) => <SkeletonJobCard key={index} />)
          ) : (
            <>
              <JobListings jobs={filteredJobs} totalJobs={filteredJobs.length} appliedJobs={appliedJobs} origin="yourOriginValue" />
              <PaginationComponent
                jobsPerPage={10}
                totalJobs={totalJobs}
                paginate={paginate}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
