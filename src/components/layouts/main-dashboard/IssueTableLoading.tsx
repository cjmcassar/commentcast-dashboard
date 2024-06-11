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

export default function IssueTableLoading({}: Props) {
  return (
    <div>
      {' '}
      <Table>
        <TableHeader>
          <TableRow className="pointer-events-none">
            <TableHead>Screenshot</TableHead>
            <TableHead># of Logs</TableHead>
            <TableHead>Platform Arch</TableHead>
            <TableHead>Platform OS</TableHead>
            <TableHead className="hidden md:table-cell">Source URL</TableHead>
            <TableHead className="hidden md:table-cell">
              Primary Display
            </TableHead>
            <TableHead>Browser Name</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100%] mb-3" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
