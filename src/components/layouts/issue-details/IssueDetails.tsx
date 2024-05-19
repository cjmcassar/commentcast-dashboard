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

class Issue {
  browser_name: string | null = null;
  created_at: string = '';
  id: number = 0;
  logs:
    | Array<{
        level: string;
        text: string;
        url?: string;
      }>
    | undefined = [];
  platform_arch: string = '';
  platform_os: string = '';
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null = null;
  screenshot: string = '/placeholder.svg';
  url: string | null = null;

  constructor(data?: Partial<Issue>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

const IssueDetails = ({ slug }: Props) => {
  const [issue, setIssue] = useState<Issue>(new Issue());
  const supabase = createClient();

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
        setIssue(new Issue());
      } else {
        setIssue(new Issue(data));
      }
    };

    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
                className="aspect-square rounded-md object-contain"
                height={245}
                width={640}
                src={issue.screenshot}
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
                      {issue.logs && issue.logs.length > 0 ? (
                        <ul>
                          {issue.logs.map((log, index) => (
                            <li key={index}>
                              <strong>{log.level}:</strong>{' '}
                              {JSON.stringify(log.text)}
                              {log.url && <a href={log.url}>Source</a>}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue.platform_arch}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue.platform_os}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="hidden md:table-cell">
                      {issue.url}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="hidden md:table-cell">
                      {issue.primary_display_dimensions
                        ? `${issue.primary_display_dimensions.primary_display_width} x ${issue.primary_display_dimensions.primary_display_height}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue.browser_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{issue.created_at}</TableCell>
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
