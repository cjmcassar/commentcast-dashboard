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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  is_public: boolean;
}

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

  const handlePublicSwitchChange = async () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);

    if (selectedIssueId !== null) {
      const { data, error } = await supabase
        .from('issue_snapshots')
        .update({ is_public: newIsPublic })
        .eq('id', selectedIssueId)
        .select('is_public')
        .single();

      if (error) {
        console.error('Error updating issue:', error);
        toast({
          title: 'Error',
          description: 'Failed to update issue visibility. Please try again.',
        });
      } else {
        console.log('Issue visibility updated:', data.is_public);
        toast({
          title: 'Success',
          description: data.is_public
            ? 'Issue is now public (anyone can view it)'
            : 'Issue is private. Please add their email before sharing the link',
        });
      }
    }
  };

  const generateShareableLink = (issueId: number) => {
    return `${window.location.origin}/issues/${issueId}`;
  };

  // Function to handle sharing the issue
  const handleShareClick = async (issueId: number) => {
    setSelectedIssueId(issueId);
    setIsShareDialogOpen(true);

    // Fetch current public status from Supabase
    const { data, error } = await supabase
      .from('issue_snapshots')
      .select('is_public')
      .eq('id', issueId)
      .single();

    if (error) {
      console.error('Error fetching public status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch issue details. Please try again.',
      });
    } else if (data) {
      setIsPublic(data.is_public);
    }
  };

  const handleShareConfirm = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    if (selectedIssueId !== null && sharedWithEmail) {
      const shareableLink = generateShareableLink(selectedIssueId);
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast({
          title: `User email added to shared with and link copied to clipboard!`,
          description: 'Share the link with your team.',
        });
      });
      supabase
        .from('issue_snapshots')
        .update({ shared_with: [sharedWithEmail] })
        .eq('id', selectedIssueId)
        .then((response) => {
          if (response.error) {
            console.error(
              'Error updating issue share details:',
              response.error
            );
          } else {
            console.log(
              'Issue share details updated successfully:',
              response.data
            );
          }
        });

      setIsShareDialogOpen(false);
    } else {
      toast({
        title: 'Invalid Submission',
        description: 'Please check the email address and try again.',
      });
    }
  };

  const handleQuickShareClick = (issueId: number) => {
    const shareableLink = generateShareableLink(issueId);
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast({
          title: 'Shareable link copied to clipboard!',
          description:
            'You can now share the link quickly without additional permissions.',
        });
        setIsShareDialogOpen(false);
      })
      .catch((error) => {
        console.error('Failed to copy link to clipboard:', error);
        toast({
          title: 'Error',
          description: 'Failed to copy link to clipboard. Please try again.',
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
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIssueId !== null) {
      deleteIssue(selectedIssueId);
    }
    setIsDeleteDialogOpen(false);
  };

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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Enter the user&apos;s email to share the issue
            </DialogTitle>
            <DialogDescription>
              This will create a shareable link that you can send to the user.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleShareConfirm}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3"
                  onChange={(e) => setSharedWithEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button onClick={() => setIsShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
            <div className="flex flex-col ">
              <Separator className="my-4" />
              <DialogDescription className="my-2">
                Alternatively, create a link if you have already added a user.
              </DialogDescription>
              <div className="flex items-center space-x-2 my-4">
                <Switch
                  id="is_public"
                  checked={isPublic ?? false}
                  onCheckedChange={handlePublicSwitchChange}
                />
                <Label htmlFor="is_public">
                  Make Issue Public (anyone can view)
                </Label>
              </div>
              <Button
                onClick={() => handleQuickShareClick(selectedIssueId as number)}
              >
                Share Link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueTable;
