"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useJobsData } from "@/context/jobsData";
interface Pagination {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}
interface Props {
  pagination: Pagination;
  page: number;
  changePage: (page: number) => void;
}

export default function PaginationComponent({
  pagination,
  page,
  changePage,
}: Props) {
  const { totalPages } = pagination;

  const handlePrevious = () => {
    if (totalPages > 0 && page > 1) {
      changePage(page - 1);
    }
  };

  const handleNext = () => {
    if (totalPages > 0 && page < totalPages) {
      changePage(page + 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== page) {
      changePage(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPages); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  let activePages = pageNumbers.slice(
    Math.max(0, page - 1 - pageNumLimit),
    Math.min(page - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const renderPages = () => {
    const renderedPages = activePages.map((pageNumber, idx) => (
      <PaginationItem key={idx}>
        <PaginationLink
          className={page === pageNumber ? "bg-secondary" : ""}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => changePage(activePages[0] - 1)}
        />
      );
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() => changePage(activePages[activePages.length - 1] + 1)}
        />
      );
    }

    return renderedPages;
  };

  return (
    <>
      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevious} />
            </PaginationItem>

            {renderPages()}

            <PaginationItem>
              <PaginationNext onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
