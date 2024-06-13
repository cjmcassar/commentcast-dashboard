import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {};

export default function ConsoleAndNetworkTableLoading({}: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Console - ( 0 Exception Types, 0 Log Types )</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-[100px] max-w-[100px]">
              <div className="flex items-center">
                <Skeleton className="h-4 w-[100%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-[100px] max-w-[100px]">
              <div className="flex items-center">
                <Skeleton className="h-4 w-[100%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-[100px] max-w-[100px]">
              <div className="flex items-center">
                <Skeleton className="h-4 w-[100%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium w-[100px] max-w-[100px]">
              <div className="flex items-center">
                <Skeleton className="h-4 w-[100%]" />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
