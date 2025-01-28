"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { fetchJobById } from '@/store/slices/jobSlice';
import { Button } from '@/components/ui/button';
import { CiCircleCheck } from 'react-icons/ci';
import Image from 'next/image';
import { IoShareSocialOutline, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { Card } from '@/components/ui/card';

// Placeholder for additional components
const AdditionalComponent1 = () => (
  <div className="my-10">
    <h2 className="text-2xl font-bold">Additional Component 1</h2>
    <p className="text-signininput">Content for additional component 1 goes here.</p>
  </div>
);

const AdditionalComponent2 = () => (
  <div className="my-10">
    <h2 className="text-2xl font-bold">Additional Component 2</h2>
    <p className="text-signininput">Content for additional component 2 goes here.</p>
  </div>
);

const JobDescription = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const { job, status } = useSelector((state: RootState) => state.job);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id as string));
    }
  }, [id, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading job details</div>;
  }

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "Full-Time":
        return "bg-signature text-background";
      case "Marketing":
      case "Design":
        return " ";
      default:
        return "bg-gray-300 dark:bg-gray-300 text-gray-800";
    }
  };

  const companyLogo = job?.company?.companyLogo || '/images/placeholderimage.png';  

  return (
    <>
      {job && (
        <div className="mx-5 md:container">
          {/* Hero Section */}
          <div className="bg-gray-100 py-3 md:py-10">
            <div className="mx-3 md:container">
              <div className="">
                <Card className="my-5 bg-background p-4">
                  <div className="flex justify-between mb-5 md:mb-2">
                    <div className="flex items-center">
                      <Image
                        width={61}
                        height={61}
                        src={companyLogo}
                        alt={job.company.companyName}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h3 className="md:text-xl text-lg font-bold">{job.title}</h3>
                        <div className="flex md:gap-3 items-center">
                          <p className="text-sm text-gray-600">
                            {job.company.companyName} • {job.city}, {job.province}, {job.country}
                          </p>
                          <div className="md:block hidden">
                            <IoCheckmarkDoneSharp className="text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:mt-3">
                      <div className="md:hidden mb-2 flex justify-end">
                        <IoShareSocialOutline className="text-signature" size={20} />
                      </div>
                      <p className="md:text-xl text-md font-bold">${job.salary.from} - ${job.salary.to} USD / {job.jobType}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-3 md:ml-20 items-center">
                      {job.skills.map((skill) => (
                        <Button
                          variant={"outline"}
                          className={`rounded-full ${getTagStyle(skill)}`}
                          key={skill}
                        >
                          {skill}
                        </Button>
                      ))}
                      <div className="md:block hidden">
                        <IoShareSocialOutline className="text-signature" size={30} />
                      </div>
                    </div>
                    <div className="flex flex-col mt-2">
                      {/* Add any actions like Apply or Bookmark */}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 pt-16 pb-10">
            <div className="w-full md:w-2/3">
              <div>
                <div className="">
                  <h1 className="text-3xl font-bold text-modaltext pb-5">Job Description</h1>
                  <p className="text-signininput">{job.description}</p>
                </div>
                <div className="my-10">
                  <h1 className="text-3xl text-modaltext font-bold pb-5">Responsibilities</h1>
                  {job.skills.map((skill, index) => (
                    <div key={index} className="flex items-center mb-5 gap-5">
                      <CiCircleCheck className="text-signature w-32 md:w-8 " size={25} />
                      <p className="text-signininput">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="md:px-10">
                <div className="flex items-center mb-5 justify-between">
                  <h1 className="text-signininput">Job Posted On</h1>
                  <p className="text-modaltext">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center mb-5 justify-between">
                  <h1 className="text-signininput">Job Type</h1>
                  <p className="text-modaltext">{job.jobType}</p>
                </div>
                <div className="flex items-center mb-5 justify-between">
                  <h1 className="text-signininput">Salary</h1>
                  <p className="text-modaltext">${job.salary.from} - ${job.salary.to} USD</p>
                </div>
                <hr className="border-hrline my-6" />
                <div className="">
                  <h1 className="text-3xl font-bold text-modaltext pb-5">Categories</h1>
                  <div className="flex gap-3">
                    <Button className="bg-yellowBg text-base text-yellow rounded-[20px]">{job.company.sector}</Button>
                  </div>
                  <hr className="border-hrline my-6" />
                </div>
                <div className="">
                  <h1 className="text-3xl font-bold text-modaltext pb-5">Required Skills</h1>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, index) => (
                      <Button key={index} className="bg-muted text-base text-signature">{skill}</Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="">
              <h1 className="text-3xl font-bold text-modaltext pb-5">Perks & Benefits</h1>
              <p className="text-signininput">This job comes with several perks and benefits</p>
            </div>
            <div className="flex flex-wrap md:items-center md:justify-between my-10 gap-2">
              <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl px-6 py-3 md:px-16 md:py-8">
                <Image src="/images/benefits/statoscope.png" alt="statoscope" width={50} height={50} />
                <h1 className="text-modaltext">Full Healthcare</h1>
              </div>
              <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                <Image src="/images/benefits/vacation.png" alt="statoscope" width={50} height={50} />
                <h1 className="text-modaltext">Unlimited Vacation</h1>
              </div>
              <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                <Image src="/images/benefits/development.png" alt="statoscope" width={50} height={50} />
                <h1 className="text-modaltext">Skill Development</h1>
              </div>
              <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                <Image src="/images/benefits/summits.png" alt="statoscope" width={50} height={50} />
                <h1 className="text-modaltext">Team Summits</h1>
              </div>
            </div>
          </div>

          {/* Additional Components Below Description */}
          <div>
            <AdditionalComponent1 />
            <AdditionalComponent2 />
          </div>
        </div>
      )}
    </>
  );
};

export default JobDescription;
