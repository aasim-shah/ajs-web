"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaginationComponent from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RootState, AppDispatch } from "@/store";
import {
  getJobsByCompany,
  getJobById,
  deleteJob,
  updateJob,
  toggleJobActiveStatus,
} from "@/store/slices/postJobSlice";
import { format } from "date-fns";
import { MdEdit } from "react-icons/md";
import TrashIcon from "../../../../public/images/newicons/trush.svg";
import EditJobDialog from "./components/EditJobDialog";
import JobDetailsDialog from "./components/JobDetailsDialog";

interface Job {
  _id: string;
  title: string;
  sector: string;
  skills: string[];
  country: string;
  city: string;
  province: string;
  description: string;
  benefits: string[];
  salary: {
    from: number;
    to: number;
  };
  availability: string;
  careerLevel: string;
  jobType: string;
  candidateType: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  workPermitNeeded: boolean;
}

interface FormStateData {
  jobTitle: string;
  sector: string;
  skillsRequired: string[];
  country: string;
  city: string;
  province: string;
  description: string;
  benefits: string[];
  salaryFrom: string;
  salaryTo: string;
  urgency: string;
  careerLevel: string;
  jobType: string;
  candidateType: string;
  workPermitNeeded: boolean;
}

const AllCompaniesData = () => {
  const [page, setPage] = useState<number>(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null); // New state to track selected row
  const dispatch = useDispatch<AppDispatch>();
  const {
    jobs: fetchedJobs,
    status,
    error,
    pagination,
  } = useSelector((state: RootState) => state.postJob);

  const [paginationState, setPaginationState] = useState({
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null as number | null,
    previousPage: null as number | null,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isJobDetailsDialogOpen, setIsJobDetailsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [editFormData, setEditFormData] = useState<FormStateData>({
    jobTitle: "",
    sector: "",
    skillsRequired: [],
    country: "",
    city: "",
    province: "",
    description: "",
    benefits: [],
    salaryFrom: "",
    salaryTo: "",
    urgency: "",
    careerLevel: "",
    jobType: "",
    candidateType: "",
    workPermitNeeded: true,
  });

  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : null;

  useEffect(() => {
    if (companyId) {
      dispatch(getJobsByCompany({ companyId, page }));
    }
  }, [dispatch, companyId, page]);

  useEffect(() => {
    if (fetchedJobs) {
      setJobs(fetchedJobs);
    }
  }, [fetchedJobs]);

  useEffect(() => {
    if (pagination) {
      setPaginationState({
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.currentPage || 1,
        hasNextPage: pagination.hasNextPage || false,
        hasPreviousPage: pagination.hasPreviousPage || false,
        nextPage: pagination.nextPage,
        previousPage: pagination.previousPage,
      });
    }
  }, [pagination]);

  if (status === "loading") return <LoadingSkeleton />;
  if (status === "failed") return <div>Error: {error}</div>;

  const handleEditClick = async (jobId: string) => {
    setSelectedJobId(jobId);
    const response = await dispatch(getJobById(jobId)).unwrap();
    if (response && response.job) {
      setEditFormData({
        jobTitle: response.job.title,
        sector: response.job.sector,
        skillsRequired: response.job.skills || [],
        country: response.job.country,
        city: response.job.city,
        province: response.job.province,
        description: response.job.description,
        benefits: response.job.benefits || [],
        salaryFrom: response.job.salary?.from
          ? response.job.salary.from.toString()
          : "",
        salaryTo: response.job.salary?.to
          ? response.job.salary.to.toString()
          : "",
        urgency: response.job.availability,
        careerLevel: response.job.careerLevel,
        jobType: response.job.jobType,
        candidateType: response.job.candidateType,
        workPermitNeeded: response.job.workPermitNeeded || true,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleViewClick = async (jobId: string) => {
    setSelectedJobId(jobId);
    const response = await dispatch(getJobById(jobId)).unwrap();
    if (response && response.job) {
      setSelectedJob(response.job);
      setIsJobDetailsDialogOpen(true);
    }
  };

  const changeJobStatus = async (jobId: string) => {
    try {
      console.log({ jobId });

      // Dispatch the toggleJobActiveStatus action and wait for the result
      await dispatch(toggleJobActiveStatus(jobId)).unwrap();

      // Optional: Update the local state if needed
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, active: !job.active } : job
        )
      );
    } catch (error) {
      console.error("Failed to toggle job status:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedJobId) {
      const updatedJobData = {
        title: editFormData.jobTitle,
        sector: editFormData.sector,
        skills: editFormData.skillsRequired,
        benefits: editFormData.benefits,
        salary: {
          from: parseInt(editFormData.salaryFrom),
          to: parseInt(editFormData.salaryTo),
        },
        availability: editFormData.urgency,
        careerLevel: editFormData.careerLevel,
        jobType: editFormData.jobType,
        candidateType: editFormData.candidateType,
        city: editFormData.city,
        province: editFormData.province,
        country: editFormData.country,
        description: editFormData.description,
        workPermitNeeded: editFormData.workPermitNeeded,
      };

      await dispatch(
        updateJob({ id: selectedJobId, jobData: updatedJobData })
      ).unwrap();
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === selectedJobId ? { ...job, ...updatedJobData } : job
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (selectedJobId) {
      await dispatch(deleteJob(selectedJobId)).unwrap();
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== selectedJobId)
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const renderJobRow = (job: Job) => (
    <TableRow
      key={job._id}
      onClick={() => setSelectedRow(job._id)} // Set selected row on click
      className={
        selectedRow === job._id
          ? "bg-mutedLight"
          : "cursor-pointer hover:bg-mutedLight"
      }
    >
      {/* <TableCell className="text-center">
        <div className="flex items-center justify-center">
          <Checkbox id={`job-${job._id}`} checked={selectedRow === job._id} />
        </div>
      </TableCell> */}
      <TableCell
        className="text-center font-medium cursor-pointer"
        onClick={() => handleViewClick(job._id)}
      >
        {job.title}
      </TableCell>

      <TableCell className="text-center ">
        <button
          onClick={() => {
            changeJobStatus(job._id);
          }}
          className=" flex justify-center items-center   text-signature"
        >
          <h1 className="border rounded-full  border-signature  py-2 px-2 ">
            {job.active ? "Active" : "Freezed"}
            {/* {false ? "Active" : "Freezed"} */}
          </h1>
        </button>
      </TableCell>

      <TableCell className="text-center">
        {format(new Date(job.createdAt), "dd MMM, yyyy")}
      </TableCell>
      <TableCell className="text-center">
        {job.careerLevel.charAt(0).toUpperCase() + job.careerLevel.slice(1)}{" "}
        Level
      </TableCell>
      <TableCell className="flex justify-end items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleEditClick(job._id)}
          className="bg-mutedLight text-signature"
        >
          <MdEdit size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDeleteClick(job._id)}
          className="bg-mutedLight text-signature"
        >
          <TrashIcon width={20} height={20} />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      <main className="my-4 px-4 flex-1">
        <div className="pb-3">
          <h1 className="text-2xl font-bold pb-3">All Posted Jobs</h1>
          <p>Showing {jobs.length} Jobs</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[50px]"></TableHead>{" "} */}
              {/* Empty header for checkbox */}
              <TableHead className="text-center">Job Title</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Created Date</TableHead>
              <TableHead className="text-center">Career Level</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{jobs.map(renderJobRow)}</TableBody>
        </Table>
      </main>

      {jobs.length > 9 && (
        <PaginationComponent
          page={page}
          pagination={paginationState}
          changePage={setPage}
        />
      )}

      <EditJobDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        formData={editFormData}
        setFormData={setEditFormData}
      />

      <JobDetailsDialog
        isOpen={isJobDetailsDialogOpen}
        onClose={() => setIsJobDetailsDialogOpen(false)}
        job={selectedJob}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px] p-3">
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant={"destructive"}
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCompaniesData;
