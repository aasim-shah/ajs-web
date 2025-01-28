import JobCardMd from "@/components/JobCardMd";
import JobCardSm from "@/components/JobCardSm";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdGridView } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  applyForJob,
  fetchJobById,
  getSavedJobs,
  toggleSaveJob,
} from "../../../../store/slices/jobSeekerSlice";
import { declineJob } from "../../../../store/slices/rejectedSlice";
import { Job } from "../../../../store/slices/types";
import { useCommonData } from "@/context/commonData";
import JobCard from "./JobCard";

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
  const { gridView, toggleGridView } = useCommonData();
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker, status, error } = useSelector(
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
        toast({
          title: "Application Submitted",
          description: "Your job application was submitted successfully!",
        });
      } catch (error: any) {
        console.error("Failed to apply for job:", error);

        const errorMessage =
          typeof error === "string" ? error : "Unknown error occurred";
        toast({
          title: "Application Failed",
          description: `Failed to apply for job: ${errorMessage}`,
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

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

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
            onClick={toggleGridView}
          >
            <MdGridView />
          </div>
        </div>
      </div>
      <div className="mb-5 md:mb-10">
        <p>Showing {totalJobs} results</p>
      </div>

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div
          className={gridView ? "grid grid-cols-1 md:grid-cols-2 gap-5" : ""}
        >
          {jobs.map((job: Job) => {
            return <JobCard key={job._id} job={job} gridView={gridView} />;
          })}
        </div>
      )}
    </div>
  );
};

export default JobListings;
