"use client";
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  jobsPerPage: number;
  totalJobs: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ jobsPerPage, totalJobs, paginate, currentPage, totalPages }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
            </PaginationItem>
          )}
          {pageNumbers.map(number => (
            <PaginationItem key={number}>
              <PaginationLink href="#" isActive={number === currentPage} onClick={() => paginate(number)}>
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => paginate(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
