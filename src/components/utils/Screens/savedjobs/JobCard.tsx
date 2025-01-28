import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  applyForJob,
  fetchJobById,
  getSavedJobs,
  toggleSaveJob,
} from "../../../../store/slices/jobSeekerSlice";
import { declineJob } from "../../../../store/slices/rejectedSlice";
import JobCardMd from "@/components/JobCardMd";
import JobCardSm from "@/components/JobCardSm";
import { Card } from "@/components/ui/card";
import { useCommonData } from "@/context/commonData";
import Link from "next/link";

const JobCard = ({ job, gridView }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker } = useSelector((state: RootState) => state.jobSeeker);
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
    return jobSeeker?.savedJobs?.some((job: any) => job._id === jobId);
  };
  const companyLogo = job.company?.companyLogo;
  return (
    <Link
      href={{
        pathname: `/job-description/${job._id}`,
        query: { origin: "saved-jobs" },
      }}
    >
      <Card className="bg-background mb-5 p-4 cursor-pointer">
        <div className="md:hidden">
          <JobCardSm
            job={job}
            handleBookmarkClick={handleBookmarkClick}
            isJobSaved={isJobSaved}
            handleApplyClick={handleApplyClick}
            handleDeclineClick={handleDeclineClick}
          />
        </div>
        <div className="hidden md:block">
          {gridView ? (
            <JobCardSm
              job={job}
              handleBookmarkClick={handleBookmarkClick}
              isJobSaved={isJobSaved}
              handleApplyClick={handleApplyClick}
              handleDeclineClick={handleDeclineClick}
            />
          ) : (
            <JobCardMd
              job={job}
              handleBookmarkClick={handleBookmarkClick}
              isJobSaved={isJobSaved}
              handleApplyClick={handleApplyClick}
              handleDeclineClick={handleDeclineClick}
            />
          )}
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
