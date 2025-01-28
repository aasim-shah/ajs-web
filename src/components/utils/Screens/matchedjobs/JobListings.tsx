"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MdGridView } from "react-icons/md";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  toggleSaveJob,
  fetchJobById,
  getSavedJobs,
  applyForJob,
} from "@/store/slices/jobSeekerSlice";
import { declineJob } from "@/store/slices/rejectedSlice";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@/store/slices/types";

interface JobListingsProps {
  jobs: Job[];
  totalJobs: number;
  origin: string;
}

const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  totalJobs,
  origin,
}) => {
  const [isGridView, setIsGridView] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker, status, applyError } = useSelector(
    (state: RootState) => state.jobSeeker
  );
  const { toast } = useToast();

  useEffect(() => {
    const jobSeekerId = localStorage.getItem("_id");
    const accessToken = localStorage.getItem("accessToken");
    if (jobSeekerId && accessToken) {
      dispatch(getSavedJobs({ jobSeekerId, accessToken }));
    }
  }, [dispatch]);

  const getJobSeekerId = (): string | null => {
    const jobSeekerId = localStorage.getItem("_id");
    return jobSeekerId ? jobSeekerId.trim() : null;
  };

  const getAccessToken = (): string | null => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? accessToken.trim() : null;
  };

  const handleBookmarkClick = async (jobId: string) => {
    const jobSeekerId = getJobSeekerId();
    const accessToken = getAccessToken();

    if (jobSeekerId && accessToken) {
      try {
        await dispatch(fetchJobById(jobId)).unwrap();
        await dispatch(
          toggleSaveJob({ jobId, jobSeekerId, accessToken })
        ).unwrap();
        toast({
          title: "Job Saved",
          description: "Job saved successfully!",
        });
      } catch (error) {
        console.error("Failed to save job:", error);
        toast({
          title: "Failed to Save Job",
          description: "There was an error saving the job.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Missing jobSeekerId or accessToken");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId or accessToken",
        variant: "destructive",
      });
    }
  };

  const handleApplyClick = async (jobId: string) => {
    const jobSeekerId = getJobSeekerId();

    if (jobSeekerId) {
      try {
        await dispatch(applyForJob({ jobId, jobSeekerId })).unwrap();
        setAppliedJobs((prev) => [...prev, jobId]);
        toast({
          title: "Application Submitted",
          description: "Your job application was submitted successfully!",
        });
      } catch (error) {
        console.error("Failed to apply for job:", error);
        const errorMessage = applyError || "Unknown error occurred";
        if (errorMessage.includes("already applied")) {
          setAppliedJobs((prev) => [...prev, jobId]);
          toast({
            title: "Already Applied",
            description: "You have already applied for this job.",
          });
        } else {
          toast({
            title: "Application Failed",
            description: `Failed to apply for job: ${errorMessage}`,
            variant: "destructive",
          });
        }
      }
    } else {
      console.error("Missing jobSeekerId or accessToken");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId or accessToken",
        variant: "destructive",
      });
    }
  };

  const handleDeclineClick = async (jobId: string) => {
    const jobSeekerId = getJobSeekerId();

    if (jobSeekerId) {
      try {
        await dispatch(declineJob({ jobId, jobSeekerId })).unwrap();
        toast({
          title: "Job Declined",
          description: "You have declined the job successfully.",
        });
      } catch (error) {
        console.error("Failed to decline job:", error);
        toast({
          title: "Decline Failed",
          description: "There was an error declining the job.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Missing jobSeekerId or accessToken");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId or accessToken",
        variant: "destructive",
      });
    }
  };

  const isJobSaved = (jobId: string) => {
    return jobSeeker?.savedJobs?.some((job) => job._id === jobId);
  };

  const hasAppliedForJob = (jobId: string) => {
    return (
      jobSeeker?.appliedJobs?.some((job) => job._id === jobId) ||
      appliedJobs.includes(jobId)
    );
  };

  return (
    <div className="md:w-full p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="">
          <h2 className="lg:text-3xl md:text-2xl text-xl font-bold">
            All Jobs
          </h2>
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
        <p>Showing {totalJobs} results</p>
      </div>
      <div
        className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-5" : ""}
      >
        {jobs.map((job: Job) => (
          <Link
            key={job._id}
            href={{
              pathname: `/job-description/${job._id}`,
              query: { origin },
            }}
          >
            <Card key={job._id} className="mb-5 p-4 cursor-pointer">
              <div className="">
                <div className="bg-background">
                  <div className="flex justify-between mb-5 md:mb-2">
                    <div className="flex items-center">
                      {job?.company?.companyLogo ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                          <Image
                            src={job.company?.companyLogo}
                            alt={job.company?.companyName || "Company Logo"}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                          <span>No Logo</span>
                        </div>
                      )}
                      <div>
                        <h3 className="md:text-xl text-lg font-bold">
                          {job.title}
                        </h3>
                        <div className="flex md:gap-3 items-center">
                          <p className="text-sm text-gray-600">
                            {job?.company?.companyName} • {job.city},{" "}
                            {job.province}, {job.country}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleBookmarkClick(job._id);
                        }}
                      >
                        {isJobSaved(job._id) ? (
                          <BsBookmarkDashFill
                            className="text-signature"
                            size={20}
                          />
                        ) : (
                          <BsBookmarkDash
                            className="text-signature"
                            size={20}
                          />
                        )}
                      </div>
                      <p className="md:text-xl text-md font-bold">
                        ${job.salary.from}/Monthly
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-3 md:ml-20 items-center mt-2">
                      <Button
                        variant={"outline"}
                        className="bg-sky-300 text-signature text-sm md:px-4 md:py-2 rounded-[30px] inline-block"
                      >
                        {job.jobType}
                      </Button>
                      <div className="hidden md:block h-5 border border-lightgrey"></div>
                      {job.skills.map((skill) => (
                        <Button
                          variant={"outline"}
                          key={skill}
                          className="border border-darkGrey text-darkGrey text-sm px-4 py-2 rounded-[30px] inline-block"
                        >
                          {skill}
                        </Button>
                      ))}
                      <div
                        className="md:block hidden cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          handleBookmarkClick(job._id);
                        }}
                      >
                        {isJobSaved(job._id) ? (
                          <BsBookmarkDashFill
                            className="text-signature"
                            size={20}
                          />
                        ) : (
                          <BsBookmarkDash
                            className="text-signature"
                            size={20}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleApplyClick(job._id);
                            }}
                            disabled={hasAppliedForJob(job._id)}
                            className={`text-background md:px-10 md:py-5 py-3 px-4 ${
                              hasAppliedForJob(job._id)
                                ? "bg-sky-200"
                                : "bg-signature"
                            }`}
                          >
                            {hasAppliedForJob(job._id)
                              ? "Applied"
                              : "Apply Now"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{job.title}</DialogTitle>
                            <DialogDescription>
                              Your application has been sent.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant={"link"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeclineClick(job._id);
                        }}
                        className="text-red-500 md:px-10 md:py-5 py-3 px-4 ml-2"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobListings;
