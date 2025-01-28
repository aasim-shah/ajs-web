import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation'; // Import useParams from next/navigation
import { AppDispatch, RootState } from '@/store'; // Adjust the path as necessary
import { fetchJobApplicationDetail } from '@/store/slices/appliedApplicantSlice/appliedApplicantSlice';

type Experience = {
  from: string;
  to: string;
  onGoing: boolean;
  jobTitle: string;
  description: string;
};

const PersonalInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applicationDetail: jobApplication, status, error } = useSelector((state: RootState) => state.appliedApplicant);
  const params = useParams(); // Use useParams to get the dynamic route parameters
  const applicationId = params.id as string; // Extract applicationId from params
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null; // Fetch token from local storage

  useEffect(() => {
    if (applicationId && token) {
      dispatch(fetchJobApplicationDetail({ applicationId, token }));
    }
  }, [dispatch, applicationId, token]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!jobApplication) {
    return null;
  }

  const { jobSeeker } = jobApplication;

  const calculateTotalExperience = (experience: Experience[]): number => {
    const totalExperience = experience.reduce((acc, exp) => {
      const from = new Date(exp.from);
      const to = exp.onGoing ? new Date() : new Date(exp.to);
      const years = to.getFullYear() - from.getFullYear();
      const months = to.getMonth() - from.getMonth();
      const totalYears = years + months / 12;
      return acc + totalYears;
    }, 0);
    return totalExperience;
  };

  const totalExperience = calculateTotalExperience(jobSeeker.experience);

  return (
    <div className='pb-10'>
      <h1 className="text-custom-dark-blue text-xl">Personal Info</h1>
   
      <div className="mt-5">
        <div className="flex gap-4">
          <div className="w-1/2 ">
            <p className='text-custom-gray-blue md:text-sm'>Full Name</p>
            <p className='text-custom-dark-blue md:text-sm'>{`${jobSeeker.firstName} ${jobSeeker.lastName}`}</p>
          </div>
          <div className="w-1/2 ">
            <p className='text-custom-gray-blue md:text-sm'>Gender</p>
            <p className='text-custom-dark-blue md:text-sm'>{jobSeeker.gender}</p>
          </div>
        </div>

        <div className="flex mt-5 gap-4">
          <div className="w-1/2 ">
            <p className='text-custom-gray-blue md:text-sm'>Date of Birth</p>
            <p className='text-custom-dark-blue md:text-sm'>{new Date(jobSeeker.dateOfBirth).toDateString()}</p>
          </div>
          <div className="w-1/2 ">
            <p className='text-custom-gray-blue md:text-sm'>Language</p>
            <p className='text-custom-dark-blue md:text-sm'>{jobSeeker.languages.join(', ')}</p>
          </div>
        </div>
       
        <div className="flex mt-5 gap-4">
          <div className="w-1/2 ">
            <p className='text-custom-gray-blue md:text-sm'>Address</p>
            <p className='text-custom-dark-blue md:text-sm'>{jobSeeker.city}, {jobSeeker.province}, {jobSeeker.country}</p>
          </div>
        </div>
        <div className='border border-secondary my-5'></div>
      </div>

      <div className="mt-6">
        <h1 className="text-custom-dark-blue text-xl">Professional Info</h1>
        <div className="mt-5 ">
          <p className='text-custom-gray-blue md:text-sm'>About Me</p>
          <h1 className='text-custom-dark-blue md:text-sm'>{jobSeeker.introduction}</h1>
        </div>

        <div className="mt-5">
          <div className="flex gap-4">
            <div className="w-1/2 ">
              <p className='text-custom-gray-blue md:text-sm'>Current Job</p>
              <p className='text-custom-dark-blue md:text-sm'>{jobSeeker.experience[0]?.jobTitle || 'N/A'}</p>
            </div>
            <div className="w-1/2 ">
              <p className='text-custom-gray-blue md:text-sm'>Experience in Years</p>
              <p className='text-custom-dark-blue md:text-sm'>{totalExperience.toFixed(1)} Years</p>
            </div>
          </div>

          <div className="flex mt-5 gap-4">
            <div className="w-1/2 ">
              <p className='text-custom-gray-blue md:text-sm'>Highest Qualification Held</p>
              <p className='text-custom-dark-blue md:text-sm'>{jobSeeker.education[jobSeeker.education.length - 1]?.levelOfEducation || 'N/A'}</p>
            </div>
            <div className="w-1/2 ">
              <p className='text-custom-gray-blue md:text-sm'>Skill set</p>
              <div className='flex flex-wrap gap-2'>
                {jobSeeker.skills.map(skill => (
                  <span key={skill} className="bg-secondary text-signature md:text-sm px-2 py-1 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
