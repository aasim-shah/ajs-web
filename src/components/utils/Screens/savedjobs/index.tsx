"use client"
import React from 'react'
// import HeroSection from './HeroSection'
import AllJobs from './SavedJobs'
import withProtectedRoutes from '@/components/HOC/ProtectedRoutes'


const index = () => (
  <>
    

    <div className='bg-background '>
        <AllJobs/>
       
    </div>
  </>
)

export default withProtectedRoutes(index)
