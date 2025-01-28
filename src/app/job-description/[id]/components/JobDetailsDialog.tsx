import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Job } from "@/store/slices/types";
import Image from "next/image";

interface JobDetailsDialogProps {
  job: Job;
  applied: boolean;
  onApplyClick: () => void;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ job, applied, onApplyClick }) => {
  const companyLogo = job?.company?.companyLogo || null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">More Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Complete details about the job and company.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-6">
            {companyLogo ? (
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  position: "relative",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={companyLogo}
                  alt={job.company.companyName || 'Company Logo'}
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
                }}
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{job.company.companyName}</h3>
              <p className="text-sm text-gray-600">
                {job.city}, {job.province}, {job.country}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-md font-semibold">Job Type:</h4>
              <p>{job.jobType}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold">Career Level:</h4>
              <p>{job.careerLevel}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold">Availability:</h4>
              <p>{job.availability}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold">Candidate Type:</h4>
              <p>{job.candidateType}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold">Salary:</h4>
              <p>
                ${job.salary.from} - ${job.salary.to} per month
              </p>
            </div>
            {job.sector && (
              <div>
                <h4 className="text-md font-semibold">Sector:</h4>
                <p>{job.sector}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-md font-semibold">Description:</h4>
            <p>{job.description}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold">Skills:</h4>
            <ul className="list-disc list-inside">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="text-md font-semibold">Benefits:</h4>
              <ul className="list-disc list-inside">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {job.company.companyImages && job.company.companyImages.length > 0 && (
            <div>
              <h4 className="text-md font-semibold">Company Images:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {job.company.companyImages.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Company Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={onApplyClick}
            disabled={applied}
            className={`text-background px-4 py-2 ${applied ? "bg-gray-400" : "bg-signature"}`}
          >
            {applied ? "Applied" : "Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
