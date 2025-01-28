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
import { useToast } from "@/components/ui/use-toast";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllApplications,
  shortlistApplication,
  rejectApplication,
  acceptApplicant,
  rejectApplicant,
  scheduleInterview,
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
  const { toast } = useToast();

  const [page, setPage] = useState<number>(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [isShortlistDialogOpen, setIsShortlistDialogOpen] = useState(false);
  const [scheduleInterviewDialogOpen, setScheduleInterviewDialogOpen] =
    useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  let token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  let companyId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : null;

  const {
    applications = [],
    pagination,
    status,
    error,
  } = useSelector((state: RootState) => state.appliedApplicant);

  const [selectedStatus, setSelectedStatus] = useState("pending");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    if (token && companyId) {
      dispatch(
        fetchAllApplications({ companyId, token, page, status: selectedStatus })
      );
    }
  }, [dispatch, token, companyId, page, selectedStatus]);

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
    // setSelectedApplicationId((prevSelectedId) =>
    //   prevSelectedId === applicationId ? null : applicationId
    // );
    setSelectedApplicationId(applicationId);
  };

  const handleShortlistConfirm = async () => {
    if (selectedApplicationId && token) {
      const resp = await dispatch(
        shortlistApplication({ applicationId: selectedApplicationId, token })
      );
      if (resp.payload && (resp.payload as any).shortlisted) {
        toast({
          title: "Application shortlisted",
          description: "Application has been shortlisted",
          variant: "default",
        });
      }
      setIsShortlistDialogOpen(false);
    }
  };
  const handleScheduleInterviewBtn = async () => {
    if (selectedApplicationId && token) {
      const resp = await dispatch(
        // shortlistApplication({ applicationId: selectedApplicationId, token })
        scheduleInterview({ applicationId: selectedApplicationId, token })
      );
      console.log({ resp });

      setScheduleInterviewDialogOpen(false);
    }
  };

  const handleRejectConfirm = () => {
    console.log({ selectedApplicationId });
    if (selectedApplicationId && token) {
      dispatch(
        rejectApplication({ applicationId: selectedApplicationId, token })
      );
      setIsRejectDialogOpen(false);
    }
  };

  // const handleAccepetApplicant = async () => {
  //   try {
  //     if (selectedApplicationId && token) {
  //       dispatch(
  //         acceptApplicant({ applicationId: selectedApplicationId, token })
  //       );
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  const handleAccepetApplicant = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const companyId =
        typeof window !== "undefined" ? localStorage.getItem("_id") : null;

      if (selectedApplicationId && token && companyId) {
        // Await the completion of the acceptApplicant action
        const resp = await dispatch(
          acceptApplicant({ applicationId: selectedApplicationId, token })
        ).unwrap(); // Ensure it resolves before proceeding

        toast({
          title: "Application accepted",
          description: resp.msg,
          variant: "default",
        });

        // Now re-fetch the updated list of applications
        dispatch(
          fetchAllApplications({
            companyId,
            token,
            page,
            status: selectedStatus,
          })
        );
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // const handleRejectApplicant = async () => {
  //   try {
  //     if (selectedApplicationId && token) {
  //       dispatch(
  //         rejectApplicant({ applicationId: selectedApplicationId, token })
  //       );
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  const handleRejectApplicant = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const companyId =
        typeof window !== "undefined" ? localStorage.getItem("_id") : null;

      if (selectedApplicationId && token && companyId) {
        // Await the completion of the acceptApplicant action
        const resp = await dispatch(
          rejectApplicant({ applicationId: selectedApplicationId, token })
        ).unwrap(); // Ensure it resolves before proceeding

        toast({
          title: "Application rejected",
          description: resp.msg,
          variant: "default",
        });

        // Now re-fetch the updated list of applications
        dispatch(
          fetchAllApplications({
            companyId,
            token,
            page,
            status: selectedStatus,
          })
        );
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="flex flex-row justify-between items-center">
          <div className="pb-3">
            <h1 className="text-2xl font-bold pb-3">All Applied Candidates</h1>
            <p>Showing {applications.length} People</p>
          </div>
          <div className="flex flex-row gap-4 justify-between">
            <label
              className={`cursor-pointer py-2 px-4 rounded-md  ${
                selectedStatus === "pending"
                  ? "bg-[#0772FF] text-white border-[#0772FF]"
                  : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="pending"
                className="hidden"
                checked={selectedStatus === "pending"}
                onChange={handleChange}
              />
              Pending
            </label>

            <label
              className={`cursor-pointer py-2 px-4 rounded-md  ${
                selectedStatus === "shortlisted"
                  ? "bg-[#0772FF] text-white border-[#0772FF]"
                  : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="shortlisted"
                className="hidden"
                checked={selectedStatus === "shortlisted"}
                onChange={handleChange}
              />
              Shortlisted
            </label>

            <label
              className={`cursor-pointer py-2 px-4 rounded-md  ${
                selectedStatus === "accepted"
                  ? "bg-[#0772FF] text-white border-[#0772FF]"
                  : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                name="status"
                value="accepted"
                className="hidden"
                checked={selectedStatus === "accepted"}
                onChange={handleChange}
              />
              Interviewing
            </label>
          </div>
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
              <TableHead className="text-center">Status</TableHead>
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
                      {/* Convert matched to a number before using toFixed */}
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
                <TableCell className="text-center">
                  {application.status === "accepted"
                    ? "Interviewing"
                    : application.status}
                </TableCell>
                {application.status === "pending" && (
                  <TableCell className="flex justify-end items-center gap-3">
                    <Link
                      href={"/dashboard/messages"}
                      className="p-2 bg-background rounded-xl text-center transition-colors"
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
                      {/* {application.status === "shortlisted" ? (
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
                      )} */}

                      <BookmarkIcon
                        className="text-signature opacity-50"
                        width={20}
                        height={20}
                      />
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
                )}
                {application.status === "shortlisted" && (
                  <TableCell className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedApplicationId(application._id);
                        setScheduleInterviewDialogOpen(true);
                      }}
                      className="bg-[#0772FF] text-white border-[#0772FF] py-2 px-3 border-2 rounded-lg transition-colors"
                    >
                      Schedule Interview
                      {/* Select for Interview */}
                    </button>
                    <button
                      onClick={() => {}}
                      className="py-2 px-3 rounded-xl transition-colors bg-background text-center"
                    >
                      <TrashIcon
                        className="text-signature"
                        width={25}
                        height={25}
                      />
                    </button>
                  </TableCell>
                )}

                {application.status === "accepted" && (
                  <TableCell className="flex justify-end items-center gap-3">
                    <button
                      onClick={handleAccepetApplicant}
                      className="bg-[#0772FF] text-white border-[#0772FF] py-2 px-3 border-2 rounded-lg transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleRejectApplicant}
                      className="py-2 px-3 rounded-lg bg-[#DB5868] text-white border-2"
                    >
                      Reject
                    </button>
                  </TableCell>
                )}
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

      {/* select for interview */}
      <Dialog
        open={scheduleInterviewDialogOpen}
        onOpenChange={setScheduleInterviewDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] p-5">
          <DialogHeader className="space-y-3 ">
            <DialogTitle className="pt-3"> Schedule Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to Schedule this interview ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant={"destructive"}
              onClick={handleScheduleInterviewBtn}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCompaniesData;
