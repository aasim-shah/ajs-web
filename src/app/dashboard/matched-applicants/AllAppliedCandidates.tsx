"use client";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import PaginationComponent from "@/components/Pagination";
import useFetchCompanies from "@/hooks/useFetchCompanies";
 
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTable from "@/components/DataTable";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiFillDelete } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { BsBookmarkDash } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Checkbox } from "@/components/ui/checkbox";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL   || 'https://ajs-server.hostdonor.com/api/v1';
// Define the Pagination interface
interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

const AllCompaniesData = () => {
  const [page, setPage] = useState<number>(1);
  const api = `${baseUrl}/companies?page=${page}`;
  const [pagination, setPagination] = useState<Pagination>({
    totalPages: 5,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  });

  const { data, loading, error } = useFetchCompanies(api, setPagination);

  // Empty companies array for now
  const companies: [] = [];

  const headers = [
    "Picture",
    "Name",
    "Contact Info",
    "Sector",
    "Joined at",
    "Company Size",
    "Action",
  ];

  if (loading) return <LoadingSkeleton />;

  const renderCompanyRow = (company: never) => null;

  return (
    <div>
      <main className="my-4 px-4 flex-1">
        <div className="pb-3">
          <h1 className="text-2xl font-bold pb-3">All Matched Seekers</h1>
          <p>Showing 0 People</p>
        </div>
        <DataTable headers={headers} data={companies} renderRow={renderCompanyRow} />
      </main>

      <PaginationComponent page={page} pagination={pagination} changePage={setPage} />
    </div>
  );
};

export default AllCompaniesData;
