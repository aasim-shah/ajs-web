import React, { useState } from "react";
import { CiBookmarkMinus } from "react-icons/ci";
import JobDetailsDialog from './JobDetailsDialog';
import { Job } from "@/store/slices/types";
import Image from "next/image";

interface SimilarJobsProps {
  jobs: Job[];
}

const SimilarJobs: React.FC<SimilarJobsProps> = ({ jobs }) => {
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApplyClick = (jobId: string) => {
    setAppliedJobs([...appliedJobs, jobId]);
  };

  return (
    <div className="mx-5 md:container md:py-24 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-2xl text-blackish">Similar Jobs</h1>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 py-10 gap-8">
        {jobs.map((job: Job, index: number) => (
          <div
            key={index}
            className="p-4 bg-background w-full shadow-sm rounded-lg border flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              {job.company?.companyLogo ? (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "relative",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={job.company.companyLogo}
                    alt={job.company.companyName || 'Company Logo'}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                  }}
                />
              )}
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-300 mx-4"></div>
              <div className="text-sm text-signature bg-muted p-2 rounded-full">
                {job.jobType}
              </div>
              <div className="">
                <CiBookmarkMinus size={30} className="text-signature" />
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {job.description}
              </p>
            </div>
           
            <div className="flex items-center text-signature">
              <JobDetailsDialog
                job={job}
                applied={appliedJobs.includes(job._id)}
                onApplyClick={() => handleApplyClick(job._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
