"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store"; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MdGridView } from "react-icons/md";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { JobOffer } from "@/store/slices/jobOfferSlice"; // Adjust the import path as needed

interface JobListingsProps {
  jobs: JobOffer[]; // Changed to JobOffer[]
  totalJobs: number;
  origin: string;
  onAccept: (offerId: string) => void; // Added
  onReject: (offerId: string) => void; // Added
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, totalJobs, origin, onAccept, onReject }) => {
  const [isGridView, setIsGridView] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const { jobSeeker } = useSelector((state: RootState) => state.jobSeeker);
  const { toast } = useToast();

  const handleAcceptClick = (offerId: string) => {
    onAccept(offerId);
  };

  const handleRejectClick = (offerId: string) => {
    onReject(offerId);
  };

  return (
    <div className="md:w-full p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="">
          <h2 className="lg:text-3xl md:text-2xl text-xl font-bold">All Job Offers</h2>
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
      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-5" : ""}>
        {jobs.map((job: JobOffer) => (
          <Card key={job._id} className="mb-5 p-4 cursor-pointer">
            <div className="">
              <div className="bg-background">
                <div className="flex justify-between mb-5 md:mb-2">
                  <div className="flex items-center">
                    <Image
                      width={61}
                      height={61}
                      src="/images/placeholderimage.png" // Use a default image or job-specific image if available
                      alt="Company Logo"
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="md:text-xl text-lg font-bold">{job.jobTitle}</h3>
                      <div className="flex md:gap-3 items-center">
                        <p className="text-sm text-gray-600">
                          {job.jobLocation || 'Location N/A'}
                        </p>
                        <div className="md:block hidden">
                          <IoCheckmarkDoneSharp className="text-signature" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:mt-3">
                    {/* Add more details if available */}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-wrap gap-3 md:ml-20 items-center mt-2">
                    {/* Additional job offer details if available */}
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAcceptClick(job._id);
                      }}
                      className="text-background bg-signature md:px-10 md:py-5 py-3 px-4"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRejectClick(job._id);
                      }}
                      className="text-background bg-red-500 md:px-10 md:py-5 py-3 px-4"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobListings;
