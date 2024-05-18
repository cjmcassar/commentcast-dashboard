'use client';

import { createClient } from '@/utils/supabase/client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  slug: string;
};

interface Issue {
  browser_name: string | null;
  created_at: string;
  id: number;
  logs: Array<any>; // Consider defining a more specific type for log entries if possible
  platform_arch: string;
  platform_os: string;
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null;
  screenshot: string;
  url: string | null;
}

const IssueDetails = ({ slug }: Props) => {
  const [issue, setIssue] = useState<Issue | undefined>();
  const supabase = createClient();

  let tempSlug = 3;

  useEffect(() => {
    const fetchIssue = async () => {
      const { data, error } = await supabase
        .from('issue_snapshots')
        .select('*')
        .eq('id', slug)
        .single();
      if (error) {
        console.error('Error fetching issue:', error);
        // Set default values if there's an error or no data
      } else {
        setIssue(data || undefined);
      }
    };

    fetchIssue();
  }, [tempSlug]);

  console.log('issue', issue);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          {/* <CardDescription>The noted issues details below</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Image
                alt="Product image"
                className="aspect-square rounded-md "
                height={245}
                width={640}
                src={issue?.screenshot || '/placeholder.svg'}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Browser Details </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {issue?.logs && issue.logs.length > 0 ? (
                        <div>
                          <div>
                            <strong>{issue.logs[0].level}:</strong>{' '}
                            {JSON.stringify(issue.logs[0].text)}
                            {issue.logs[0].url && (
                              <a href={issue.logs[0].url}>Source</a>
                            )}
                          </div>
                          {issue.logs.length > 1 && (
                            <div>
                              <em>and {issue.logs.length - 1} more...</em>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue?.platform_arch}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue?.platform_os}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="hidden md:table-cell">
                      {issue?.url}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="hidden md:table-cell">
                      {issue?.primary_display_dimensions
                        ? `${issue.primary_display_dimensions.primary_display_width} x ${issue.primary_display_dimensions.primary_display_height}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue?.browser_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue?.created_at}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueDetails;
