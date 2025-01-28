"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllApplications,
  shortlistApplication,
  rejectApplication,
} from "@/store/slices/appliedApplicantSlice/appliedApplicantSlice";
import { RootState, AppDispatch } from "@/store";
import MessageIcon from "../../../../public/images/newicons/message01.svg";
import TrashIcon from "../../../../public/images/newicons/trush.svg";
import BookmarkIcon from "../../../../public/images/newicons/bookmark01.svg";
import { BsBookmarkDashFill } from "react-icons/bs";
import PaginationComponent from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Experience {
  from: string;
  to: string;
  onGoing: boolean;
}

interface JobSeeker {
  firstName: string;
  lastName: string;
  profilePicture: string;
  experience?: Experience[];
}

interface Job {
  title: string;
  sector: string;
}

interface JobApplication {
  _id: string;
  job: Job;
  jobSeeker: JobSeeker;
  shortlisted?: boolean;
  matched: number;
  status: string;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

const AllCompaniesData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [isShortlistDialogOpen, setIsShortlistDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : null;

  const {
    applications = [],
    pagination,
    status,
    error,
  } = useSelector((state: RootState) => state.appliedApplicant);

  useEffect(() => {
    if (token && companyId) {
      dispatch(fetchAllApplications({ companyId, token, page }));
    }
  }, [dispatch, token, companyId, page]);

  const calculateTotalExperience = (experience: Experience[] = []): string => {
    let totalExperience = 0;

    experience.forEach((job) => {
      const fromDate = new Date(job.from);
      const toDate = job.onGoing ? new Date() : new Date(job.to);

      if (toDate >= fromDate) {
        const duration = toDate.getTime() - fromDate.getTime();
        totalExperience += duration;
      }
    });

    const experienceInYears = totalExperience / (1000 * 60 * 60 * 24 * 365);

    if (experienceInYears < 1) {
      const experienceInMonths = experienceInYears * 12;
      return `${Math.round(experienceInMonths)} months`;
    } else {
      return `${experienceInYears.toFixed(1)} years`;
    }
  };

  const handleRowClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleShortlistConfirm = () => {
    if (selectedApplicationId && token) {
      dispatch(
        shortlistApplication({ applicationId: selectedApplicationId, token })
      );
      setIsShortlistDialogOpen(false);
    }
  };

  const handleRejectConfirm = () => {
    if (selectedApplicationId && token) {
      dispatch(
        rejectApplication({ applicationId: selectedApplicationId, token })
      );
      setIsRejectDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="pb-3">
          <h1 className="text-2xl font-bold pb-3">All Applied Candidates</h1>
          <p>Showing {applications.length} People</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>{" "}
              {/* Empty header for checkbox */}
              <TableHead className="text-center">Name</TableHead>{" "}
              {/* Name header, covers both picture and name */}
              <TableHead className="text-center">Matched</TableHead>
              <TableHead className="text-center">Job Title</TableHead>
              <TableHead className="text-center">Experience</TableHead>
              <TableHead className="text-center">Action</TableHead>{" "}
              {/* Align action buttons to the right */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application._id}
                onClick={() => handleRowClick(application._id)}
                className={
                  selectedApplicationId === application._id
                    ? "bg-mutedLight cursor-pointer"
                    : "cursor-pointer hover:bg-mutedLight"
                }
              >
                <TableCell className="text-center">
                  <Checkbox
                    id={`checkbox-${application._id}`}
                    checked={selectedApplicationId === application._id}
                    onChange={() => handleRowClick(application._id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-5 items-center justify-center">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <Image
                        src={application.jobSeeker.profilePicture}
                        alt={`${application.jobSeeker.firstName} ${application.jobSeeker.lastName}`}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Link href={`/applicant-profile/${application._id}`}>
                      <span>{`${application.jobSeeker.firstName} ${application.jobSeeker.lastName}`}</span>
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center text-signature">
                    <h1 className="border rounded-full border-signature py-2 px-2">
                      {/* {application.matched?.toFixed(1)}% Matched */}
                      {Number(application.matched).toFixed(1)}% Matched
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {application.job.title}
                </TableCell>
                <TableCell className="text-center">
                  {calculateTotalExperience(application.jobSeeker.experience)}
                </TableCell>
                <TableCell className="flex justify-end items-center gap-3">
                  <Link
                    href={`/dashboard/messages?chatUserId=${application.jobSeeker._id}`}
                  >
                    <MessageIcon
                      className="text-signature"
                      width={25}
                      height={25}
                    />
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedApplicationId(application._id);
                      setIsShortlistDialogOpen(true);
                    }}
                    className="p-3 rounded-xl transition-colors bg-background text-center"
                  >
                    {application.status === "shortlisted" ? (
                      <BsBookmarkDashFill
                        className="text-signature"
                        size={15}
                      />
                    ) : (
                      <BookmarkIcon
                        className="text-signature opacity-50"
                        width={20}
                        height={20}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedApplicationId(application._id);
                      setIsRejectDialogOpen(true);
                    }}
                    className="p-2 rounded-xl transition-colors bg-background text-center"
                  >
                    <TrashIcon
                      className="text-signature"
                      width={25}
                      height={25}
                    />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {applications.length > 9 && (
        <PaginationComponent
          page={page}
          pagination={pagination}
          changePage={setPage}
        />
      )}

      <Dialog
        open={isShortlistDialogOpen}
        onOpenChange={setIsShortlistDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] p-3">
          <DialogHeader>
            <DialogTitle>Shortlist Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to shortlist this application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant={"destructive"}
              onClick={handleShortlistConfirm}
            >
              Shortlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-3">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant={"destructive"}
              onClick={handleRejectConfirm}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCompaniesData;
