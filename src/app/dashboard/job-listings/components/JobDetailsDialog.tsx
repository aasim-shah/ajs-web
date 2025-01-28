// JobDetailsDialog.tsx
"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface JobDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
}

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-5">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4">
            <p><strong>Sector:</strong> {job.sector}</p>
            <p><strong>Skills Required:</strong> {job.skills.join(", ")}</p>
            <p><strong>Country:</strong> {job.country}</p>
            <p><strong>City:</strong> {job.city}</p>
            <p><strong>Province:</strong> {job.province}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Benefits:</strong> {job.benefits.join(", ")}</p>
            <p><strong>Salary:</strong> {job.salary.from} - {job.salary.to}</p>
            <p><strong>Availability:</strong> {job.availability}</p>
            <p><strong>Career Level:</strong> {job.careerLevel}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Candidate Type:</strong> {job.candidateType}</p>
            <p><strong>Work Permit Needed:</strong> {job.workPermitNeeded ? "Yes" : "No"}</p>
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
