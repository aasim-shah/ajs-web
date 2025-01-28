"use client";
import React from 'react'
import HeroSection from './HeroSection'
import Description from './Description'
import Discord from './Discord'
import SimilarJobs from './SimilarJobs'
import withProtectedRoutes from '@/components/HOC/ProtectedRoutes'

const index = () => {
  return (
    <>
    <HeroSection/>
    <Description/>
    <Discord/>
    <SimilarJobs/>
    </>
  )
}

export default withProtectedRoutes(index)