"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchShortlistedApplications,
  rejectApplication,
  shortlistApplication,
} from "@/store/slices/appliedApplicantSlice/appliedApplicantSlice";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaginationComponent from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import MessageIcon from "../../../../public/images/newicons/message01.svg";
import TrashIcon from "../../../../public/images/newicons/trush.svg";
import BookmarkIcon from "../../../../public/images/newicons/bookmark01.svg";
import { BsBookmarkDashFill } from "react-icons/bs";
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

const AllShortlistedApplications = () => {
  const [page, setPage] = useState<number>(1);
  const [isShortlistDialogOpen, setIsShortlistDialogOpen] = useState(false);

  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Retrieve state from Redux
  const { applications, pagination, status, error } = useSelector(
    (state: RootState) => state.appliedApplicant
  );

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    const companyId = localStorage.getItem("_id");

    if (token && companyId) {
      dispatch(fetchShortlistedApplications({ companyId, token, page }));
    }
  }, [dispatch, page]);

  if (status === "loading") return <LoadingSkeleton />;
  if (status === "failed") return <div>Error: {error}</div>;

  const headers = ["", "Name", "Matched", "Sector", "Experience", "Action"];

  const handleRowClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handleShortlistConfirm = () => {
    if (selectedApplicationId && token) {
      dispatch(
        shortlistApplication({ applicationId: selectedApplicationId, token })
      );
      setIsShortlistDialogOpen(false);
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

  const renderApplicationRow = (application: (typeof applications)[0]) => (
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
              src={
                application.jobSeeker.profilePicture ||
                "/images/placeholderimage.png"
              }
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
            {/* {application.matchedPercentage.toFixed(1)}% Matched */}
            {Number(application.matched).toFixed(1)}% Matched
          </h1>
        </div>
      </TableCell>
      <TableCell className="text-center">{application.job.sector}</TableCell>
      <TableCell className="text-center">
        {application.jobSeeker.experience.length} Years Experience
      </TableCell>
      <TableCell className="flex justify-end items-center gap-3">
        <Link
          href={"/dashboard/messages"}
          className="p-2 bg-mutedLight rounded-xl text-center transition-colors"
        >
          <MessageIcon className="text-signature" width={25} height={25} />
        </Link>
        {/* <button
          onClick={() => {
            setSelectedApplicationId(application._id);
            setIsRejectDialogOpen(true);
          }}
          className="p-3 rounded-xl transition-colors bg-signature text-center"
          style={{ color: "white" }} // Set your desired color here
        >
          <BookmarkIcon className="text-white" width={20} height={20} />
        </button> */}

        <button
          onClick={() => {
            setSelectedApplicationId(application._id);
            setIsShortlistDialogOpen(true);
          }}
          className="p-3 rounded-xl transition-colors bg-background text-center"
        >
          {application.status === "shortlisted" ? (
            <BsBookmarkDashFill className="text-signature" size={15} />
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
          className="p-2 rounded-xl transition-colors bg-mutedLight text-center"
        >
          <TrashIcon className="text-signature" width={25} height={25} />
        </button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="pb-3">
          <h1 className="text-2xl font-bold pb-3">
            All Shortlisted Candidates
          </h1>
          <p>Showing {applications.length} Candidates</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="text-center">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{applications.map(renderApplicationRow)}</TableBody>
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
      {/* Reject Dialog Logic Goes Here */}
    </div>
  );
};

export default AllShortlistedApplications;
