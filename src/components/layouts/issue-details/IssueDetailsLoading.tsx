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

export default function IssueDetailsLoading({}: Props) {
  return (
    <div>
      {' '}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Browser Details </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          <TableRow>
            <TableCell>
              <div className="flex items-center">
                <strong>Platform Arch:</strong>{' '}
                <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center">
                <strong>Platform OS:</strong>{' '}
                <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="hidden md:table-cell">
              <div className="flex items-center">
                <strong>Source URL:</strong>{' '}
                <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="hidden md:table-cell">
              <div className="flex items-center">
                <strong>Primary Display:</strong>{' '}
                <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center">
                <strong>Browser Name:</strong>{' '}
                <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center">
                <strong>Date:</strong> <Skeleton className="ml-2 h-4 w-[40%]" />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
