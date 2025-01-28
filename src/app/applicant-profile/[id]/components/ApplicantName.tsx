import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation'; // Import useParams from next/navigation
import { AppDispatch, RootState } from '@/store'; // Adjust the path as necessary
import { fetchJobApplicationDetail } from '@/store/slices/appliedApplicantSlice/appliedApplicantSlice';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { IoIosPhonePortrait } from 'react-icons/io';
import { CiLinkedin } from 'react-icons/ci';
import { AiOutlineMail } from 'react-icons/ai';
import { FaSquareFacebook } from 'react-icons/fa6';
import { TfiWorld } from 'react-icons/tfi';

const ApplicantName = () => {
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

  const { jobSeeker, job, status: applicationStatus, createdAt } = jobApplication;

  return (
    <>
      <div className="flex gap-5 p-3">
        <div>
          <Image
            src={jobSeeker.profilePicture || '/images/placeholderimage.png'}
            alt="profile"
            width={70}
            height={70}
          />
        </div>
        <div>
          <h1 className="text-custom-dark-blue mb-2 text-xl">{`${jobSeeker.firstName} ${jobSeeker.lastName}`}</h1>
          <h1 className="text-custom-gray-blue text-sm">{jobSeeker.profession}</h1>
        </div>
      </div>

      <div className="bg-secondary rounded-lg m-3">
        <div className="flex border-b justify-between p-3">
          <h1>Applied Jobs</h1>
          <h1>{new Date(createdAt).toDateString()}</h1>
        </div>

        <div className="p-3 ">
          <div>
            <h1 className="text-custom-dark-blue mb-2 text-xl">{job.title}</h1>
            <h1 className="text-custom-gray-blue text-sm">{`${job.sector} . ${job.jobType}`}</h1>
          </div>
        </div>
      </div>

      <div className="w-full md:py-3 px-3">
        <div className="flex justify-between">
          <div className="pb-3">
            <h1>Profile Matched</h1>
          </div>
          <div>
            <h1>50%</h1>
          </div>
        </div>
        <Progress
          color="bg-signature"
          value={50}
          className="md:w-[100%] w-[80%]"
        />
      </div>

      <div className="px-5">
        <p className="text-custom-gray-blue md:text-sm">Status</p>
        <div className="flex flex-wrap gap-2">
          <span className={`bg-signature text-background md:text-sm px-2 py-1 ${applicationStatus === 'reviewing' ? '' : 'bg-secondary text-signature'}`}>
            {applicationStatus}
          </span>
        </div>
      </div>
      <div className="px-3 my-5">
        <hr />
      </div>

      {/* contact */}
      <div className="pb-3 px-3">
        <div className="">
          <h1 className="text-modaltext text-xl">Contact</h1>
        </div>
        <div className="pt-3">
          <div className="flex gap-5">
            <div>
              <AiOutlineMail className="text-signininput4" size={20} />
            </div>
            <div>
              <h1 className="text-sm text-signininput4">Email</h1>
              <p className="text-sm text-signature">{jobSeeker.userInfo?.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex gap-5">
            <div>
              <IoIosPhonePortrait className="text-signininput4" size={20} />
            </div>
            <div>
              <h1 className="text-sm text-signininput4">Phone</h1>
              <p className="text-sm text-signature">{jobSeeker.userInfo?.phone}</p>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex gap-5">
            <div>
              <CiLinkedin className="text-signininput4" size={20} />
            </div>
            <div>
              <h1 className="text-sm text-signininput4">LinkedIn</h1>
              <p className="text-sm text-signature">{jobSeeker.userInfo?.linkedin}</p>
            </div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex gap-5">
            <div>
              <FaSquareFacebook className="text-signininput4" size={20} />
            </div>
            <div>
              <h1 className="text-sm text-signininput4">Facebook</h1>
              <p className="text-sm text-signature">{jobSeeker.userInfo?.facebook}</p>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex gap-5">
            <div>
              <TfiWorld className="text-signininput4" size={20} />
            </div>
            <div>
              <h1 className="text-sm text-signininput4">Website</h1>
              <p className="text-sm text-signature">{jobSeeker.userInfo?.website}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantName;
