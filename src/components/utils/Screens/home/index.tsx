"use client";
import React from 'react';
import Header from "./HeroSection";
import CompaniesGrow from './CompaniesGrow';
import PopulatCategory from './PopulatCategory';
import MatchedJobs from './MatchedJobs';
import EmpowerJob from './EmpowerJob';
import useIsAuthenticated from '@/components/HOC/useIsAuthenticated'; // Import the custom hook

const Home = () => {
  const isAuthenticated = useIsAuthenticated(); // Check if the user is authenticated

  return (
    <>  
      <div className='bg-muted'>
        <Header/>
      </div>
      <CompaniesGrow/>
      <div className='bg-lightWhite'>
        <PopulatCategory/>
      </div>
      <div>
        {isAuthenticated && <MatchedJobs/>} {/* Conditionally render MatchedJobs */}
      </div>
      <div>
        <EmpowerJob/>
      </div>
    </>
  );
};

export default Home;
