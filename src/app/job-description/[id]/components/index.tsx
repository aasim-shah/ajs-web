"use client";
import React from 'react'
import HeroSection from './HeroSection'
 
import Discord from './Discord'
// import SimilarJobs from './SimilarJobs'
import withProtectedRoutes from '@/components/HOC/ProtectedRoutes'

const index = () => {
  return (
    <>
    <HeroSection/>
 
    <Discord/>
    {/* <SimilarJobs/> */}
    </>
  )
}

export default withProtectedRoutes(index)