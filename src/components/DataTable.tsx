"use client";

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
}

const DataTable = <T,>({ headers, data, renderRow }: DataTableProps<T>) => {
  return (
    <div>
      <Table className="border bottom-1">
        <TableHeader>
          <TableRow className="bg-secondary">
            {/* {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))} */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow  key={index}>{renderRow(item)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
