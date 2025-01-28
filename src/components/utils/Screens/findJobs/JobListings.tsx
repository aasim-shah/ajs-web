import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
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
  applyForJob,
  getSavedJobs,
} from "../../../../store/slices/jobSeekerSlice";
import { declineJob } from "../../../../store/slices/rejectedSlice";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "../../../../store/slices/types";

interface JobListingsProps {
  jobs: Job[];
  totalJobs: number;
  appliedJobs: any[]; // Adjusting type for appliedJobs
  origin: string;
}

const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  totalJobs,
  appliedJobs,
  origin,
}) => {
  const [isGridView, setIsGridView] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]); // Local state for saved jobs
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

  useEffect(() => {
    if (jobSeeker?.savedJobs) {
      setSavedJobIds(jobSeeker.savedJobs.map((job) => job._id));
    }
  }, [jobSeeker]);

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
        const job = await dispatch(fetchJobById(jobId)).unwrap();
        await dispatch(
          toggleSaveJob({ jobId, jobSeekerId, accessToken })
        ).unwrap();

        // Update local state to immediately show filled icon
        setSavedJobIds((prev) =>
          prev.includes(jobId)
            ? prev.filter((id) => id !== jobId)
            : [...prev, jobId]
        );

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
    return savedJobIds.includes(jobId);
  };

  const hasAppliedForJob = (jobId: string) => {
    return appliedJobs.some((job) => job.job?._id === jobId);
  };

  // Format salary in a shorter format (e.g., 12000 to 12K)
  const formatSalary = (salary: number) => {
    return salary >= 1000
      ? `${(salary / 1000).toFixed(1)}K`
      : salary.toString();
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
        {jobs.map((job: Job) => {
          const applied = hasAppliedForJob(job._id); // Check if the job has been applied for
          const companyLogo = job.company?.companyLogo;

          return (
            <Link
              key={job._id}
              href={{
                pathname: `/job-description/${job._id}`,
                query: { origin: "find-jobs" },
              }}
            >
              <Card key={job._id} className="mb-5 p-2 cursor-pointer">
                {" "}
                {/* Reduced padding */}
                {/* Desktop layout */}
                <div className="hidden md:block">
                  <div className="bg-background">
                    <div className="flex justify-between mb-5 md:mb-2">
                      <div className="flex items-center">
                        {companyLogo ? (
                          <div
                            style={{
                              width: "61px",
                              height: "61px",
                              position: "relative",
                              borderRadius: "50%",
                              overflow: "hidden",
                              marginRight: "16px",
                            }}
                          >
                            <Image
                              src={companyLogo}
                              alt={job.company?.companyName || "Company Logo"}
                              layout="fill" // Fill the container
                              objectFit="cover" // Ensure the image covers the entire container without distortion
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "61px",
                              height: "61px",
                              backgroundColor: "#ccc",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginRight: "16px",
                            }}
                          />
                        )}

                        <div>
                          <h3 className="md:text-xl text-lg font-bold">
                            {job.title}
                          </h3>
                          <div className="flex md:gap-3 items-center">
                            <p className="text-sm text-gray-600">
                              {job.company?.companyName} • {job.city},{" "}
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
                        {job.skills.slice(0, 3).map((skill) => (
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
                              disabled={applied}
                              className={`text-background md:px-10 md:py-5 py-3 px-4 ${
                                applied ? "bg-sky-200" : "bg-signature"
                              }`}
                            >
                              {applied ? "Applied" : "Apply Now"}
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
                {/* Mobile-specific layout */}
                <div className="md:hidden">
                  <div className="bg-background p-2">
                    {" "}
                    {/* Reduced padding */}
                    {/* First row with logo, job title, and bookmark icon */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {companyLogo ? (
                          <div
                            className="rounded-full overflow-hidden mr-2"
                            style={{
                              width: "48px",
                              height: "48px",
                              position: "relative",
                            }}
                          >
                            <Image
                              src={companyLogo}
                              alt={job.company?.companyName || "Company Logo"}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="rounded-full bg-gray-300 mr-2"
                            style={{ width: "48px", height: "48px" }}
                          />
                        )}
                        <h3 className="text-lg font-bold">{job.title}</h3>
                      </div>
                      <div className="cursor-pointer">
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
                    {/* Second row with company name and address */}
                    <div className="flex justify-between  items-center">
                      <div className="w-1/2">
                        <p className="text-sm font-bold">
                          {job.company?.companyName}
                        </p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-xs text-gray-600">
                          {job.city}, {job.province}, {job.country}
                        </p>
                      </div>
                    </div>
                    {/* Job type and salary in one line */}
                    <div className="flex items-center justify-between mt-2">
                      <Button
                        variant={"outline"}
                        className="bg-sky-300 text-signature text-xs px-3 py-1 rounded-[30px]"
                      >
                        {job.jobType}
                      </Button>
                      <p className="text-md font-bold">
                        {formatSalary(job.salary.from)}/Monthly
                      </p>
                    </div>
                    {/* Display up to 2 skills */}
                    {/* <div className="flex flex-wrap gap-2 mt-2">
                      {job.skills.slice(0, 2).map((skill) => (
                        <Button
                          variant={"outline"}
                          key={skill}
                          className="border border-darkGrey text-darkGrey text-xs px-3 py-1 rounded-[30px]"
                        >
                          {skill}
                        </Button>
                      ))}
                    </div> */}
                    {/* Apply and Decline buttons */}
                    <div className="flex justify-between mt-5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleApplyClick(job._id);
                            }}
                            disabled={applied}
                            className={`text-background px-4 py-1 ${
                              applied ? "bg-signature/70" : "bg-signature"
                            }`}
                          >
                            {applied ? "Applied" : "Apply Now"}
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
                        className="text-red-500 px-4 py-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default JobListings;
