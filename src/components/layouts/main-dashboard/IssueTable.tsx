'use client';

import { createClient } from '@/utils/supabase/client';
import { MoreHorizontal, Share, TrashIcon } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

type Props = {};

interface Issue {
  browser_name: string | null;
  created_at: string;
  id: number;
  logs: Array<{
    level: string;
    text: string;
    url?: string;
  }>;
  platform_arch: string;
  platform_os: string;
  primary_display_dimensions: {
    primary_display_width: string;
    primary_display_height: string;
  } | null;
  screenshot: string;
  url: string | null;
}

const IssueTable = (props: Props) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const generateShareableLink = (issueId: number) => {
    return `${window.location.origin}/issues/${issueId}`;
  };

  // Function to handle sharing the issue
  const handleShareClick = (issueId: number) => {
    const shareableLink = generateShareableLink(issueId);
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: `Shareable link copied to clipboard!`,
        description: 'Share the link with your team.',
      });
    });
  };

  const deleteIssue = async (issueId: number) => {
    const { error } = await supabase
      .from('issue_snapshots')
      .delete()
      .eq('id', issueId);

    if (error) {
      console.error('Error deleting issue:', error);
      return;
    }

    // Refresh the issues list after deletion
    setIssues((prevIssues) =>
      prevIssues.filter((issue) => issue.id !== issueId)
    );
  };

  const handleDeleteClick = (issueId: number) => {
    setSelectedIssueId(issueId);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIssueId !== null) {
      deleteIssue(selectedIssueId);
    }
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchIssues = async () => {
      const user = (await supabase.auth.getSession()).data.session?.user;
      const { data, error } = await supabase
        .from('issue_snapshots')
        .select('*')
        .eq('uuid', user?.id);

      if (error) {
        console.error('Error fetching issues:', error);
        return;
      }

      console.log('issue_snapshots data from supabase:', data);
      setIssues(data);
    };

    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Issues</CardTitle>
                <CardDescription>
                  Manage your issues and share them with your team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="pointer-events-none">
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Logs</TableHead>
                      <TableHead>Platform Arch</TableHead>
                      <TableHead>Platform OS</TableHead>
                      <TableHead className="hidden md:table-cell">
                        URL
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Primary Display
                      </TableHead>
                      <TableHead>Browser Name</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow
                        key={issue.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/issues/${issue.id}`)}
                      >
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Issue screenshot"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={
                              issue.screenshot ||
                              '/placeholder-issue-screenshot.svg'
                            }
                            width="64"
                          />
                        </TableCell>

                        <TableCell className="font-medium">
                          {issue.logs.length > 0 ? (
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

                        <TableCell>{issue.platform_arch}</TableCell>

                        <TableCell>{issue.platform_os}</TableCell>

                        <TableCell className="hidden md:table-cell">
                          {issue.url}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {issue.primary_display_dimensions
                            ? `${issue.primary_display_dimensions.primary_display_width} x ${issue.primary_display_dimensions.primary_display_height}`
                            : 'N/A'}
                        </TableCell>

                        <TableCell>{issue.browser_name}</TableCell>

                        <TableCell>{issue.created_at}</TableCell>
                        <TableCell>
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
                                  handleShareClick(issue.id);
                                }}
                              >
                                <Share className="w-4 h-4" />
                                <span className="ml-2 ">Share Issue</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(issue.id);
                                  // deleteIssue(issue.id);
                                }}
                              >
                                <TrashIcon className="w-4 h-4" />
                                <span className="ml-2 ">Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              issue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueTable;
