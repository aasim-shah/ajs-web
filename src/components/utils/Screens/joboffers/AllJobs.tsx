"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import JobListings from './JobListings';
import SkeletonJobCard from './SkeletonJobCard';
import HeroComponent from "../../../../components/repeatComponents/Hero";
import PaginationComponent from './Pagination';
import { RootState, AppDispatch } from '@/store';
import { fetchJobOffers, setCurrentPage, acceptJobOffer, rejectJobOffer } from '@/store/slices/jobOfferSlice'; // Updated import
import { JobOffer } from '@/store/slices/jobOfferSlice'; // Adjusted import for type

const AllJobOffers: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const currentPage = useSelector((state: RootState) => state.jobOffer.currentPage);
  const jobOffers = useSelector((state: RootState) => state.jobOffer.jobOffers) as JobOffer[];
  const loading = useSelector((state: RootState) => state.jobOffer.status === 'loading');
  const totalPages = useSelector((state: RootState) => state.jobOffer.totalPages);
  const totalJobOffers = useSelector((state: RootState) => state.jobOffer.totalJobOffers);

  useEffect(() => {
    const jobSeekerId = localStorage.getItem('jobSeekerId') || '';
    dispatch(fetchJobOffers(jobSeekerId));
  }, [dispatch, currentPage]);

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

  const handleAccept = (offerId: string) => {
    dispatch(acceptJobOffer({ offerId, interviewDate: '2024-08-01', interviewTime: '10:00 AM' })); // Replace with actual data collection logic
  };

  const handleReject = (offerId: string) => {
    dispatch(rejectJobOffer(offerId));
  };

  const filteredJobOffers = jobOffers.filter((offer) => {
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.some(filter => {
      return offer.jobTitle.toLowerCase().includes(filter.toLowerCase());
    });
    const matchesSearchTerm = searchTerm === '' || offer.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === '' || (offer.jobLocation ?? '').toLowerCase().includes(location.toLowerCase());

    return matchesFilters && matchesSearchTerm && matchesLocation;
  }).sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime());

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  return (
    <div>
      <div className='bg-muted md:pb-10'>
        <HeroComponent
          title="Find the best job offers!"
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
            Array.from({ length: 10 }).map((_, index) => <SkeletonJobCard key={index} />)
          ) : (
            <>
              <JobListings
                jobs={filteredJobOffers}
                totalJobs={filteredJobOffers.length}
                origin="yourOriginValue"
                onAccept={handleAccept}
                onReject={handleReject}
              />
              <PaginationComponent
                jobsPerPage={10}
                totalJobs={totalJobOffers}
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

export default AllJobOffers;
