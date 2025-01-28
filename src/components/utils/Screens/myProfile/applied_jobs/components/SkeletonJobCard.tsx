import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

const SkeletonJobRow: React.FC = () => {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="font-medium">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
      </TableCell>
      <TableCell className='flex flex-col md:flex-row gap-3'>
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
        <div>
          <div className="w-32 h-6 bg-gray-300 dark:bg-gray-300 mb-2"></div>
          <div className="w-48 h-4 bg-gray-300 dark:bg-gray-300"></div>
        </div>
      </TableCell>
      <TableCell className="md:table-cell hidden">
        <div className="w-32 h-6 bg-gray-300 dark:bg-gray-300"></div>
      </TableCell>
      <TableCell className="md:table-cell hidden">
        <div className="w-32 h-6 bg-gray-300 dark:bg-gray-300"></div>
      </TableCell>
      <TableCell>
        <div className="w-24 h-6 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
      </TableCell>
      <TableCell className="text-right hidden md:table-cell">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
      </TableCell>
    </TableRow>
  );
};

export default SkeletonJobRow;
