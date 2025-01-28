import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from '../../../../../../store/slices/appliedJobSlice/AppliedJobSlice';
import Image from 'next/image';

interface JobDetailsDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {job.company.companyLogo ? (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  position: "relative",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={job.company.companyLogo}
                  alt={job.company.companyName || "Company Logo"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#ddd",
                  borderRadius: "50%",
                }}
              />
            )}
            <DialogTitle className="text-xl font-bold">{job.company.companyName}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between">
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Career Level:</strong> {job.careerLevel}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Availability:</strong> {job.availability}</p>
            <p><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between">
            <p><strong>Salary:</strong> {job.salary?.from ? `$${job.salary.from}` : 'N/A'} - {job.salary?.to ? `$${job.salary.to}` : 'N/A'}</p>
            <p><strong>Location:</strong> {`${job.city}, ${job.province}, ${job.country}`}</p>
          </div>
          <div>
            <p><strong>Job Description:</strong></p>
            <p>{job.description}</p>
          </div>
          <div>
            <h3 className="font-bold mt-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <Button key={index} variant="outline" className="rounded-full">
                    {skill}
                  </Button>
                ))
              ) : (
                <p>No specific skills required.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mt-4">Benefits</h3>
            <ul className="list-disc pl-5">
              {job.benefits.length > 0 ? (
                job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))
              ) : (
                <p>No benefits listed.</p>
              )}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
