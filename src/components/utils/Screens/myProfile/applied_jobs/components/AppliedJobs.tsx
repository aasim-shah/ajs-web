"use client";
import React, { useState, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoFilterSharp } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableComp from './TableComp';
import { useSelector } from 'react-redux';
import { RootState } from '@/store'; // Adjust path as necessary
import { Job } from '@/store/slices/appliedJobSlice/AppliedJobSlice'; // Adjust path as necessary

type Status = 'in-review' | 'shortlisted' | 'pending';

const AppliedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);

  const { jobs } = useSelector((state: RootState) => state.appliedJobs);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: Status) => {
    setStatusFilter(prevStatusFilter => {
      if (prevStatusFilter.includes(status)) {
        return prevStatusFilter.filter(s => s !== status);
      } else {
        return [...prevStatusFilter, status];
      }
    }); 
  };

  const filteredTableData = useMemo(() => {
    const filteredJobs = jobs.filter((item: Job) =>
      (item.role.toLowerCase().includes(searchTerm.toLowerCase()) || item.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(item.status.toLowerCase() as Status))
    );

    return filteredJobs;
  }, [jobs, searchTerm, statusFilter]);

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div><h1 className='text-modaltext text-lg md:text-2xl'>Applications History</h1></div>
          <div className="flex flex-col md:flex-row  items-center gap-4">
            <div className="relative flex w-24 items-center">
              <CiSearch className="absolute left-3 text-gray-500" size={20} />
              <Input
                type="text"
                placeholder="Search by Role or Company"
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <IoFilterSharp size={20} />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['in-review', 'shortlisted', 'pending'].map(status => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status as Status)}
                      onCheckedChange={() => handleStatusFilterChange(status as Status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <TableComp jobs={filteredTableData} />
      </div>
    </>
  );
};

export default AppliedJobs;
