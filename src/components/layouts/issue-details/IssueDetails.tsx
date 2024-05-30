'use client';

import { Issue as IssueInterface } from '@/types/issue';
import { handleDeleteClick } from '@/utils/deleteIssueUtils';
import { handleShareClick } from '@/utils/shareUtils';
import { createClient } from '@/utils/supabase/client';
import { MoreHorizontal, Share, TrashIcon } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

import DeleteDialogue from '../DeleteDialogue';
import ShareDialogue from '../ShareDialogue';

type Props = {
  slug: string;
};

class Issue implements IssueInterface {
  browser_name: string | null = null;
  created_at: string = '';
  id: number = 0;
  logs: Array<{
    level: string;
    text: string;
    url?: string;
  }> = [];
  platform_arch: string = '';
  platform_os: string = '';
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null = null;
  screenshot: string = '/placeholder.svg';
  url: string | null = null;
  is_public: boolean = false;

  constructor(data?: Partial<Issue>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

const IssueDetails = ({ slug }: Props) => {
  const [issue, setIssue] = useState<Issue>(new Issue());

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const [isPublic, setIsPublic] = useState<boolean>();
  const [issuesPerPage] = useState(5);

  const [sharedWithEmail, setSharedWithEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);

  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssue = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      let query = supabase.from('issue_snapshots').select('*').eq('id', slug);

      if (user) {
        query = query.or(`uuid.eq.${user.id},shared_with.cs.{${user.email}}`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching issue:', error);
        setIssue(new Issue());
      } else if (!data) {
        console.error('No issue found');
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

  console.log(issue);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          {/* <CardDescription>The noted issues details below</CardDescription> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Open options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareClick(
                    issue.id,
                    setSelectedIssueId,
                    setIsShareDialogOpen,
                    setIsPublic,
                    toast
                  );
                }}
              >
                <Share className="w-4 h-4" />
                <span className="ml-2 ">Share Issue</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(
                    issue.id,
                    setSelectedIssueId,
                    setIsDeleteDialogOpen
                  );
                }}
              >
                <TrashIcon className="w-4 h-4" />
                <span className="ml-2 ">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                              className={`pl-3 list-decimal break-words ${log.level === 'error' ? 'text-red-500' : log.level === 'warning' ? 'text-yellow-500' : 'text-gray-500'}`}
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

      <ShareDialogue
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        selectedIssueId={selectedIssueId}
        sharedWithEmail={sharedWithEmail}
        setSharedWithEmail={setSharedWithEmail}
        isPublic={isPublic || false}
        setIsPublic={setIsPublic || (() => {})}
      />

      <DeleteDialogue
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedIssueId={selectedIssueId}
        setIssues={
          setIssue as React.Dispatch<React.SetStateAction<Issue | Issue[]>>
        }
      />
    </div>
  );
};

export default IssueDetails;
