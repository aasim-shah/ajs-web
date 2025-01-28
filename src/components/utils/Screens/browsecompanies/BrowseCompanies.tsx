import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JobListings from './CompaniesListing';
import Hero from './Hero';
import { fetchCompanies } from '@/store/slices/companySlice'; // Adjust the import path
import { RootState,AppDispatch  } from '@/store';

const AllJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const { companies, status, error } = useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(fetchCompanies({ page: 1 }));
  }, [dispatch]);


  console.log("companies",companies)
  const handleSearch = (searchTerm: string, location: string) => {
    setSearchTerm(searchTerm);
    setLocation(location);
  };

  return (
    <>
      <Hero
        title="Search Companies"
        titleClassName="text-2xl md:text-5xl md:pt-8 text-center font-bold text-darkGrey"
        onSearch={handleSearch}
        showSearchBar={true}
        showSearchFields={true}
      />
      <div className='md:container md:mt-16 pb-10 mt-4'>
        <div className="md:flex gap-5">
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' && (
            <JobListings companies={companies} searchTerm={searchTerm} location={location} />
          )}
        </div>
      </div>
    </>
  );
}

export default AllJobs;
