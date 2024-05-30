'use client';

import DeleteDialogue from '@/components/layouts/DeleteDialogue';
import ShareDialogue from '@/components/layouts/ShareDialogue';
import { Issue } from '@/types/issue';
import { handleDeleteClick } from '@/utils/deleteIssueUtils';
import { handleShareClick } from '@/utils/shareUtils';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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

const IssueTable = (props: Props) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [sharedWithEmail, setSharedWithEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);
  const [isPublic, setIsPublic] = useState<boolean>();
  const [issuesPerPage] = useState(5);

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      const startIndex = (currentPage - 1) * issuesPerPage;
      const user = (await supabase.auth.getSession()).data.session?.user;
      const { data, error, count } = await supabase
        .from('issue_snapshots')
        .select('*', { count: 'exact' })
        .eq('uuid', user?.id)
        .range(startIndex, startIndex + issuesPerPage);

      if (error) {
        console.error('Error fetching issues:', error);
        return;
      }

      console.log('issue_snapshots data from supabase:', data);
      setIssues(data);
      setTotalIssues(count || 0);
    };

    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, issuesPerPage]);

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
                        Source URL
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
                                {issue.logs[0].text.length > 50
                                  ? `${issue.logs[0].text.substring(0, 50)}...`
                                  : issue.logs[0].text}
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
                          ) : (
                            'No logs detected.'
                          )}
                        </TableCell>

                        <TableCell>{issue.platform_arch}</TableCell>

                        <TableCell>{issue.platform_os}</TableCell>

                        <TableCell className="hidden md:table-cell">
                          {issue.url && issue.url.length > 30
                            ? `${issue.url.substring(0, 30)}...`
                            : issue.url}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {issue.primary_display_dimensions
                            ? `${issue.primary_display_dimensions.primary_display_width} x ${issue.primary_display_dimensions.primary_display_height}`
                            : 'N/A'}
                        </TableCell>

                        <TableCell>{issue.browser_name}</TableCell>

                        <TableCell>
                          {new Date(issue.created_at).toLocaleDateString(
                            'en-UK',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            }
                          )}
                        </TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : undefined
                        }
                        onClick={() => {
                          setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        className={
                          currentPage * issuesPerPage >= totalIssues
                            ? 'pointer-events-none opacity-50'
                            : undefined
                        }
                        onClick={() => {
                          if (currentPage * issuesPerPage < totalIssues) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-xs text-muted-foreground">
                  Showing{' '}
                  <strong>
                    {currentPage * issuesPerPage - issuesPerPage + 1}-
                    {Math.min(currentPage * issuesPerPage, totalIssues)}
                  </strong>{' '}
                  of <strong>{totalIssues}</strong> issues
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

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
          setIssues as React.Dispatch<React.SetStateAction<Issue | Issue[]>>
        }
      />
    </div>
  );
};

export default IssueTable;
