"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchJobById, fetchSimilarJobs } from "@/store/slices/jobSlice";
import {
  applyForJob,
  toggleSaveJob,
  getSavedJobs,
  fetchAppliedJobs,
} from "@/store/slices/jobSeekerSlice"; // Added declineJob import
import { declineJob } from "@/store/slices/rejectedSlice";
import { Button } from "@/components/ui/button";
import { CiCircleCheck } from "react-icons/ci";
import Image from "next/image";
import { IoShareSocialOutline, IoCheckmarkDoneSharp } from "react-icons/io5";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Corrected import paths
import Discord from "./components/Discord";
import SimilarJobs from "./components/SimilarJobs";
import Layout from "@/components/utils/layout";

interface Job {
  _id: string;
  title: string;
  description: string;
  company: {
    companyName: string;
    companyLogo?: string;
    sector?: string;
  };
  city: string;
  province: string;
  country: string;
  jobType: string;
  salary: {
    from: number;
    to: number;
  };
  skills: string[];
  createdAt: string;
}

interface AppliedJob {
  _id: string;
  job?: Job;
  status: string;
  createdAt: string;
}

const JobDescription: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { job, status } = useSelector((state: RootState) => state.job);
  const { similarJobs } = useSelector((state: RootState) => state.job);
  const { jobSeeker } = useSelector((state: RootState) => state.jobSeeker);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id as string));
      dispatch(fetchSimilarJobs(id as string));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const jobSeekerId = localStorage.getItem("_id");
    if (jobSeekerId) {
      dispatch(fetchAppliedJobs(jobSeekerId));
      dispatch(
        getSavedJobs({
          jobSeekerId,
          accessToken: localStorage.getItem("accessToken") || "",
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    console.log("Applied Jobs:", jobSeeker?.appliedJobs);
  }, [jobSeeker]);

  const appliedJobs = jobSeeker?.appliedJobs as AppliedJob[] | undefined;

  const isApplied = appliedJobs?.some(
    (appliedJob) => appliedJob.job && appliedJob.job._id === id
  );
  const isSaved = jobSeeker?.savedJobs?.some((savedJob) => savedJob._id === id);

  const handleApplyClick = async (jobId: string) => {
    const jobSeekerId = localStorage.getItem("_id");
    if (jobSeekerId) {
      if (isApplied) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this job.",
          variant: "destructive",
        });
        return;
      }

      try {
        await dispatch(applyForJob({ jobId, jobSeekerId })).unwrap();
        toast({
          title: "Application Submitted",
          description: "Your job application was submitted successfully!",
        });
        dispatch(fetchAppliedJobs(jobSeekerId)); // Update applied jobs list
      } catch (error: any) {
        const errorMessage =
          error === "You have already applied for this job"
            ? "You have already applied for this job"
            : "Failed to apply for the job. Please try again later.";
        toast({
          title: "Application Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.error("Missing jobSeekerId");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId",
        variant: "destructive",
      });
    }
  };

  const handleDeclineClick = async (jobId: string) => {
    const jobSeekerId = localStorage.getItem("_id");
    if (jobSeekerId) {
      try {
        await dispatch(declineJob({ jobId, jobSeekerId })).unwrap();
        toast({
          title: "Job Declined",
          description: "You have declined the job successfully.",
        });
        dispatch(fetchAppliedJobs(jobSeekerId)); // Update applied jobs list
      } catch (error) {
        console.error("Failed to decline job:", error);
        toast({
          title: "Decline Failed",
          description: "There was an error declining the job.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Missing jobSeekerId");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId",
        variant: "destructive",
      });
    }
  };

  const handleBookmarkClick = async (jobId: string) => {
    const jobSeekerId = localStorage.getItem("_id");
    const accessToken = localStorage.getItem("accessToken") || "";
    if (jobSeekerId && accessToken) {
      try {
        await dispatch(
          toggleSaveJob({ jobId, jobSeekerId, accessToken })
        ).unwrap();
        toast({
          title: isSaved ? "Job Unsaved" : "Job Saved",
          description: isSaved
            ? "Job has been removed from saved jobs."
            : "Job saved successfully!",
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

  const getBreadcrumbLink = (origin: string | null) => {
    switch (origin) {
      case "find-jobs":
        return { href: "/findjobs", label: "Find Jobs" };
      case "matched-jobs":
        return { href: "/matchedjobs", label: "Matched Jobs" };
      case "saved-jobs":
        return { href: "/savedjobs", label: "Saved Jobs" };
      default:
        return { href: "/findjobs", label: "Find Jobs" };
    }
  };

  const breadcrumbLink = getBreadcrumbLink(origin);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed" || !job) {
    return <div>Error loading job details</div>;
  }

  const companyLogo = job?.company?.companyLogo || null;

  console.log({ jobDetails: job });

  return (
    <>
      <Layout>
        {job && job.company && (
          <div className="">
            {/* Breadcrumb */}
            <div className="bg-gray-100 py-3 md:py-10 ">
              <div className="mx-3 md:container">
                <div className="mx-3 md:container">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={breadcrumbLink.href}>
                          {breadcrumbLink.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbPage>{job.title}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Main Job Details */}
                <div className="">
                  <Card className="my-5 bg-background p-4">
                    {/* Desktop-specific layout */}
                    <div className="hidden md:block">
                      <div className="flex justify-between mb-5 md:mb-2">
                        <div className="flex items-center">
                          {companyLogo ? (
                            <div
                              style={{
                                width: "70px",
                                height: "70px",
                                position: "relative",
                                borderRadius: "50%",
                                overflow: "hidden",
                                marginRight: "16px",
                              }}
                            >
                              <Image
                                src={companyLogo}
                                alt={job.company.companyName || "Company Logo"}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "70px",
                                height: "70px",
                                backgroundColor: "#ccc",
                                borderRadius: "50%",
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
                                {job.company.companyName} • {job.city},{" "}
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
                            onClick={() => handleBookmarkClick(job._id)}
                          >
                            {isSaved ? (
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
                        <div className="flex flex-wrap gap-3 md:ml-20 items-center">
                          <Button className="rounded-full text-signature bg-mutedLight">
                            {job.jobType}
                          </Button>
                          {job.skills.slice(0, 2).map((skill) => (
                            <Button
                              variant={"outline"}
                              className="rounded-full"
                              key={skill}
                            >
                              {skill}
                            </Button>
                          ))}
                          <div className="md:block hidden">
                            <IoShareSocialOutline
                              className="text-signature"
                              size={30}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col mt-2">
                          <Button
                            className="bg-signature text-background text-sm px-8 py-2 rounded-md"
                            onClick={() => handleApplyClick(job._id)}
                            disabled={isApplied}
                          >
                            {isApplied ? "Applied" : "Apply"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-specific layout */}
                    <div className="md:hidden">
                      <div className="bg-background p-2">
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
                                  alt={
                                    job.company.companyName || "Company Logo"
                                  }
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
                            {isSaved ? (
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
                        <div className="flex justify-between items-center">
                          <div className="w-1/2">
                            <p className="text-sm font-bold">
                              {job.company.companyName}
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
                            {job.salary.from}/Monthly
                          </p>
                        </div>
                        {/* Display up to 2 skills */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.skills.slice(0, 2).map((skill) => (
                            <Button
                              variant={"outline"}
                              key={skill}
                              className="border border-darkGrey text-darkGrey text-xs px-3 py-1 rounded-[30px]"
                            >
                              {skill}
                            </Button>
                          ))}
                        </div>
                        {/* Apply and Decline buttons */}
                        <div className="flex justify-between mt-5">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleApplyClick(job._id);
                                }}
                                disabled={isApplied}
                                className={`text-background px-4 py-1 ${
                                  isApplied ? "bg-signature/70" : "bg-signature"
                                }`}
                              >
                                {isApplied ? "Applied" : "Apply Now"}
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
                </div>

                {/* Main content: Job Description and Similar Jobs */}
                <div className="mx-5 md:container flex flex-col md:flex-row gap-5 pt-16 pb-10">
                  <div className="w-full md:w-2/3">
                    <div>
                      <div className="">
                        <h1 className="text-3xl font-bold text-modaltext pb-5">
                          Job Description
                        </h1>
                        <p className="text-signininput">{job.description}</p>
                      </div>
                      <div className="my-10">
                        <h1 className="text-3xl text-modaltext font-bold pb-5">
                          Responsibilities
                        </h1>
                        {job.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center mb-5 gap-5"
                          >
                            <CiCircleCheck
                              className="text-signature w-32 md:w-8"
                              size={25}
                            />
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
                        <p className="text-modaltext">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center mb-5 justify-between">
                        <h1 className="text-signininput">Job Type</h1>
                        <p className="text-modaltext">{job.jobType}</p>
                      </div>
                      <div className="flex items-center mb-5 justify-between">
                        <h1 className="text-signininput">Salary</h1>
                        <p className="text-modaltext">
                          ${job.salary.from} - ${job.salary.to} USD
                        </p>
                      </div>
                      <hr className="border-hrline my-6" />
                      <div className="">
                        <h1 className="text-3xl font-bold text-modaltext pb-5">
                          Categories
                        </h1>
                        <div className="flex gap-3">
                          <Button className="bg-yellowBg text-base text-yellow rounded-[20px]">
                            {job.company.sector}
                          </Button>
                        </div>
                        <hr className="border-hrline my-6" />
                      </div>
                      <div className="">
                        <h1 className="text-3xl font-bold text-modaltext pb-5">
                          Required Skills
                        </h1>
                        <div className="flex flex-wrap gap-3">
                          {job.skills.map((skill, index) => (
                            <Button
                              key={index}
                              className="bg-muted text-base text-signature"
                            >
                              {skill}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional content sections */}
                <div className="mx-5 md:container">
                  <h1 className="text-3xl font-bold text-modaltext pb-5">
                    Perks & Benefits
                  </h1>
                  <p className="text-signininput">
                    This job comes with several perks and benefits
                  </p>
                  <div className="flex flex-wrap md:items-center md:justify-between my-10 gap-2">
                    <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl px-6 py-3 md:px-16 md:py-8">
                      <Image
                        src="/images/benefits/statoscope.png"
                        alt="statoscope"
                        width={50}
                        height={50}
                      />
                      <h1 className="text-modaltext">Full Healthcare</h1>
                    </div>
                    <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                      <Image
                        src="/images/benefits/vacation.png"
                        alt="statoscope"
                        width={50}
                        height={50}
                      />
                      <h1 className="text-modaltext">Unlimited Vacation</h1>
                    </div>
                    <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                      <Image
                        src="/images/benefits/development.png"
                        alt="statoscope"
                        width={50}
                        height={50}
                      />
                      <h1 className="text-modaltext">Skill Development</h1>
                    </div>
                    <div className="bg-muted flex flex-col gap-4 items-center justify-between rounded-xl md:px-16 px-6 py-3 md:py-8">
                      <Image
                        src="/images/benefits/summits.png"
                        alt="statoscope"
                        width={50}
                        height={50}
                      />
                      <h1 className="text-modaltext">Team Summits</h1>
                    </div>
                  </div>
                </div>

                {/* Integrate additional components */}
                <Discord />
                <SimilarJobs jobs={similarJobs} />
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default JobDescription;
