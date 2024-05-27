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
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssue = async () => {
      const user = (await supabase.auth.getSession()).data.session?.user;
      const { data, error } = await supabase
        .from('issue_snapshots')
        .select('*')
        .eq('id', slug)
        .or(`uuid.eq.${user?.id},shared_with.cs.{${user?.email}}`)
        .single();
      if (error) {
        console.error('Error fetching issue:', error);
        setIssue(new Issue());
      } else {
        setIssue(new Issue(data));
      }
    };

    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleCopyToClipboard = (text: string, label: string) => {
    let helperText = (
      <>
        The issue <b>{label}</b> has been copied to your clipboard
      </>
    );
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: 'Copied to clipboard',
          description: helperText,
        });
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        toast({
          title: 'Error',
          description: 'Failed to copy text to clipboard',
        });
      });
  };

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
                    <TableCell
                      className="font-medium w-[100px] max-w-[100px] cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(
                          JSON.stringify(issue.logs),
                          'Logs'
                        )
                      }
                    >
                      <strong>Logs:</strong>
                      {issue.logs && issue.logs.length > 0 ? (
                        <ul className="space-y-1 pl-4">
                          {issue.logs.map((log, index) => (
                            <li
                              key={index}
                              className="pl-3 list-decimal break-words"
                            >
                              <strong>{log.level}:</strong>{' '}
                              {JSON.stringify(log.text).length > 300
                                ? `${JSON.stringify(log.text).substring(0, 297)}...`
                                : JSON.stringify(log.text)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="pl-3 text-pretty">
                          No logs detected.
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(
                          issue.platform_arch,
                          'Platform Arch'
                        )
                      }
                    >
                      <strong>Platform Arch:</strong> {issue.platform_arch}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(issue.platform_os, 'Platform OS')
                      }
                    >
                      <strong>Platform OS:</strong> {issue.platform_os}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="hidden md:table-cell cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(issue.url || '', 'Source URL')
                      }
                    >
                      <strong>Source URL:</strong> {issue.url}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="hidden md:table-cell cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(
                          `${issue.primary_display_dimensions?.primary_display_width} x ${issue.primary_display_dimensions?.primary_display_height}`,
                          'Primary Display'
                        )
                      }
                    >
                      <strong>Primary Display:</strong>{' '}
                      {issue.primary_display_dimensions
                        ? `${issue.primary_display_dimensions.primary_display_width} x ${issue.primary_display_dimensions.primary_display_height}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(
                          issue.browser_name || '',
                          'Browser Name'
                        )
                      }
                    >
                      <strong>Browser Name:</strong> {issue.browser_name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() =>
                        handleCopyToClipboard(issue.created_at || '', 'Date')
                      }
                    >
                      <strong>Date:</strong>{' '}
                      {new Date(issue.created_at).toLocaleDateString('en-UK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </TableCell>
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
