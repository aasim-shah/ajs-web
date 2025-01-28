import React from "react";

interface Job {
  _id: string;
  title: string;
  description: string;
}

interface CompanyJobsProps {
  jobs: Job[];
}

const CompanyJobs: React.FC<CompanyJobsProps> = ({ jobs }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Jobs Posted by Company</h2>
      {jobs.map((job) => (
        <div key={job._id} className="mb-4 border rounded p-4">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CompanyJobs;
