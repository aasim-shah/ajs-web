import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MdGridView } from "react-icons/md";
import Image from "next/image";
import { toggleSaveJob, applyForJob } from "@/store/slices/jobSeekerSlice";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@/store/slices/types";
import { declineJob } from "@/store/slices/rejectedSlice";

interface JobListingsProps {
  jobs: Job[];
  totalJobs: number;
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, totalJobs }) => {
  const [isGridView, setIsGridView] = useState(false);
  const [localJobs, setLocalJobs] = useState<Job[]>(jobs); // Local state to manage jobs
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker, applyError } = useSelector((state: RootState) => state.jobSeeker);
  const { toast } = useToast();

  useEffect(() => {
    if (applyError) {
      toast({
        title: "Application Failed",
        description: `Failed to apply for job: ${applyError}`,
        variant: "destructive",
      });
    }
  }, [applyError, toast]);

  const handleBookmarkClick = async (e: React.MouseEvent<HTMLElement>, jobId: string) => {
    e.stopPropagation(); // Prevent card click from being triggered
    const jobSeekerId = localStorage.getItem("_id");
    const accessToken = localStorage.getItem("accessToken");
  
    if (jobSeekerId && accessToken) {
      await dispatch(toggleSaveJob({ jobId, jobSeekerId, accessToken }));
    }
  };
  

  const handleApplyClick = async (e: React.MouseEvent<HTMLButtonElement>, jobId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click from being triggered
    const jobSeekerId = localStorage.getItem("_id");

    if (jobSeekerId) {
      try {
        await dispatch(applyForJob({ jobId, jobSeekerId })).unwrap();
        toast({
          title: "Application Submitted",
          description: "Your job application was submitted successfully!",
        });
      } catch (error: any) {
        console.error('Failed to apply for job:', error);
        if (error.message === "You have already applied for this job") {
          toast({
            title: "Already Applied",
            description: "You have already applied for this job.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Application Failed",
            description: `Failed to apply for job: ${error.message || error}`,
            variant: "destructive",
          });
        }
      }
    } else {
      console.error('Missing jobSeekerId or accessToken');
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId or accessToken",
        variant: "destructive",
      });
    }
  };

  const handleDeclineClick = async (e: React.MouseEvent<HTMLButtonElement>, jobId: string) => {
    e.stopPropagation(); // Prevent card click from being triggered
    e.preventDefault();  // Prevent the default link behavior

    const jobSeekerId = localStorage.getItem('_id');
    if (jobSeekerId) {
      try {
        await dispatch(declineJob({ jobId, jobSeekerId })).unwrap();
        toast({
          title: 'Job Declined',
          description: 'The job has been removed from your declined jobs list.',
        });

        // Remove the job from the local state
        setLocalJobs(localJobs.filter(job => job._id !== jobId));

      } catch (error: any) {
        toast({
          title: 'Decline Failed',
          description: `Failed to decline the job: ${error.message || error}`,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Missing Information',
        description: 'Missing jobSeekerId or accessToken',
        variant: 'destructive',
      });
    }
  };

  const isJobSaved = (jobId: string) => {
    return jobSeeker?.savedJobs?.some((job) => job._id === jobId);
  };

  const hasAppliedForJob = (jobId: string) => {
    return jobSeeker?.appliedJobs?.some((job) => job._id === jobId);
  };

  return (
    <div className="md:w-full p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="">
          <h2 className="lg:text-3xl md:text-2xl text-xl font-bold">All Jobs</h2>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p>Sort by: </p>
          </div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Most relevant</AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="h-5 border border-foreground hidden md:block"></div>
          <div
            className="hidden md:block cursor-pointer"
            onClick={() => setIsGridView(!isGridView)}
          >
            <MdGridView />
          </div>
        </div>
      </div>
      <div className="md:mb-10">
        <p>Showing {localJobs.length} results</p>
      </div>
      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-5" : ""}>
        {localJobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          localJobs.map((job) => (
            <Link key={job._id} href={{ pathname: `/job-description/${job._id}` }}>
              <Card
                key={job._id}
                className="mb-5 p-4 cursor-pointer"
              >
                <div className="">
                  <div className="bg-background">
                    <div className="flex justify-between mb-5 md:mb-2">
                      <div className="flex items-center">
                        <Image
                          width={61}
                          height={61}
                          src={job.company?.companyLogo || "/images/placeholderimage.png"}
                          alt={job.company?.companyName || "Company Logo"}
                          className="rounded-full mr-4"
                        />  
                        <div>
                          <h3 className="md:text-xl text-lg font-bold">{job.title}</h3>
                          <div className="flex md:gap-3 items-center">
                            <p className="text-sm text-gray-600">
                              {job.company?.companyName} • {job.city}, {job.province}, {job.country}
                            </p>
                            <div className="md:block hidden">
                              <IoCheckmarkDoneSharp className="text-signature" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:mt-3">
                        <div
                          className="md:hidden mb-2 flex justify-end cursor-pointer"
                          onClick={(e) => handleBookmarkClick(e, job._id)}
                        >
                          {isJobSaved(job._id) ? (
                            <BsBookmarkDashFill className="text-signature" size={20} />
                          ) : (
                            <BsBookmarkDash className="text-signature" size={20} />
                          )}
                        </div>
                        <p className="md:text-xl text-md font-bold">${job.salary?.from}/Monthly</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-wrap gap-3 md:ml-20 items-center mt-2">
                        <Button variant={"outline"}
                          className="bg-sky-300 text-signature text-sm md:px-4 md:py-2 rounded-[30px] inline-block"
                          
                        >   
                          {job.jobType}
                        </Button>
                        <div className="hidden md:block h-5 border border-lightgrey"></div>
                        {job.skills?.map((skill) => (
                          <Button  variant={"outline"}
                            key={skill}
                            className="border border-darkGrey text-darkGrey text-sm px-4 py-2 rounded-[30px] inline-block"
                           
                          >
                            {skill}    
                          </Button>
                        ))}
                        <div
                          className="md:block hidden cursor-pointer"
                          onClick={(e) => handleBookmarkClick(e, job._id)}
                        >
                          {isJobSaved(job._id) ? (
                            <BsBookmarkDashFill className="text-signature" size={30} />
                          ) : (
                            <BsBookmarkDash className="text-signature" size={30} />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col mt-2">
                        {hasAppliedForJob(job._id) ? (
                          <Button variant="default" className="md:h-10 md:w-32 w-full">
                            Applied
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            className="md:h-10 md:w-32 w-full"
                            onClick={(e) => handleApplyClick(e, job._id)}
                          >
                            Apply
                          </Button>
                        )}
                        <Button
                          variant={"link"}
                          className="mt-2 md:h-10 md:w-32 w-full text-red-600"
                          onClick={(e) => handleDeclineClick(e, job._id)}
                        >
                          Remove Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default JobListings;
