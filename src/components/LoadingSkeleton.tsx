import { FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SkeletonRowProps {
  columns: number;
}

const SkeletonRow: FC<SkeletonRowProps> = ({ columns }) => (
  <TableRow className="animate-pulse">
    {Array.from({ length: columns }).map((_, idx) => (
      <TableCell key={idx} className="py-4 px-6">
        <div className="h-4 bg-gray-300 dark:bg-gray-300 rounded w-full"></div>
      </TableCell>
    ))}
  </TableRow>
);

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  rows = 10,
  columns = 6,
}) => (
  <Table className="min-w-full opacity-50">
    <TableBody>
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonRow key={idx} columns={columns} />
      ))}
    </TableBody>
  </Table>
);

export default LoadingSkeleton;
