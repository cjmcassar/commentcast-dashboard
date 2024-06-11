'use client';

import DeleteDialogue from '@/components/layouts/DeleteDialogue';
import ShareDialogue from '@/components/layouts/ShareDialogue';
import { Issue } from '@/types/issue';
import { handleDeleteClick } from '@/utils/deleteIssueUtils';
import { handleShareClick } from '@/utils/shareUtils';
import { createClient } from '@/utils/supabase/client';
import { MoreHorizontal, Share, TrashIcon } from 'lucide-react';

import { useEffect, useState } from 'react';

import Link from 'next/link';

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
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToastProps } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function SettingsDetails() {
  const [user, setUser] = useState<any | null>(null);
  const [combinedPublicAndSharedIssues, setCombinedPublicAndSharedIssues] =
    useState<any[] | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [sharedWithEmail, setSharedWithEmail] = useState('');
  const [isPublic, setIsPublic] = useState<boolean>();
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);
  const [issuesPerPage] = useState(3);
  const [currentPopoverPage, setCurrentPopoverPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [emailsPerPage] = useState(5);

  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSharedIssues = async () => {
      const startIndex = (currentPage - 1) * issuesPerPage;
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      setUser(user);

      const publicQuery = supabase.from('issue_snapshots').select('*');
      const sharedQuery = supabase.from('issue_snapshots').select('*');

      let getPublicIssues = async () => {
        const response = await publicQuery
          .eq('is_public', true)
          .eq('uuid', user?.id)
          .order('created_at', { ascending: false })
          .range(startIndex, startIndex + issuesPerPage);
        return response.data ?? [];
      };

      let getSharedIssues = async () => {
        const response = await sharedQuery
          .eq('uuid', user?.id)
          .not('shared_with', 'is', null)
          .neq('shared_with', '{}')
          .order('created_at', { ascending: false })
          .range(startIndex, startIndex + issuesPerPage);
        return response.data ?? [];
      };

      const publicIssues = await getPublicIssues();
      const sharedIssues = await getSharedIssues();

      const combinedIssues = [...publicIssues, ...sharedIssues];
      const uniqueIssues = combinedIssues.filter(
        (issue, index, self) =>
          index === self.findIndex((i) => i.id === issue.id)
      );
      setCombinedPublicAndSharedIssues(uniqueIssues);
      setIssues(uniqueIssues);
      setTotalIssues(uniqueIssues.length);
    };

    fetchSharedIssues();
  }, [currentPage, issuesPerPage, supabase]);

  const handleUpdateEmail = async (updatedEmail: string, issueId: number) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedEmail)) {
      toast({
        title: 'Invalid Submission',
        description: 'Please check the email address and try again.',
      } as ToastProps);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { data: currentIssueData } = await supabase
      .from('issue_snapshots')
      .select('shared_with')
      .eq('id', issueId)
      .single();

    const existingEmails = currentIssueData?.shared_with || [];
    const updatedEmails = Array.from(
      new Set([...existingEmails, updatedEmail])
    );

    const { error } = await supabase
      .from('issue_snapshots')
      .update({ shared_with: updatedEmails })
      .eq('uuid', user?.id)
      .eq('id', issueId);

    if (error) {
      console.error('Error updating issue:', error);
      toast({
        title: 'Failed to update shared emails',
      } as ToastProps);
    } else {
      toast({
        title: 'Email updated successfully',
      } as ToastProps);
      setCombinedPublicAndSharedIssues((prevIssues) =>
        prevIssues
          ? prevIssues.map((issue) =>
              issue.id === issueId
                ? { ...issue, shared_with: updatedEmails }
                : issue
            )
          : []
      );
    }
  };

  const handleRemoveEmail = async (email: string, issueId: number) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { data: currentIssueData } = await supabase
      .from('issue_snapshots')
      .select('shared_with')
      .eq('uuid', user?.id)
      .eq('id', issueId)
      .single();

    const updatedEmails = currentIssueData?.shared_with?.filter(
      (e: string) => e !== email
    );

    const { error } = await supabase
      .from('issue_snapshots')
      .update({ shared_with: updatedEmails })
      .eq('uuid', user?.id)
      .eq('id', issueId);

    if (error) {
      console.error('Error updating issue:', error);
      toast({
        title: 'Failed to update shared emails',
      } as ToastProps);
    } else {
      toast({
        title: 'Email removed successfully',
      } as ToastProps);
      setCombinedPublicAndSharedIssues((prevIssues) =>
        prevIssues
          ? prevIssues.map((issue) =>
              issue.id === issueId
                ? { ...issue, shared_with: updatedEmails }
                : issue
            )
          : []
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
          </nav>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>User Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  {combinedPublicAndSharedIssues ? (
                    <Input placeholder={`${user?.email}`} disabled />
                  ) : (
                    <Skeleton className="h-4 w-[100%]" />
                  )}
                </form>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Shared Issues</CardTitle>
                <CardDescription>
                  The issues that you have shared with other users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {combinedPublicAndSharedIssues ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell>Issue</TableCell>
                        <TableCell>Shared With</TableCell>
                        <TableCell>Issue Link</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {combinedPublicAndSharedIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>{issue.id}</TableCell>
                          <TableCell>
                            <Popover key={issue.id}>
                              <PopoverTrigger
                                asChild
                                onClick={() => {
                                  setUpdatedEmail(issue.shared_with);
                                  setTotalEmails(
                                    issue.shared_with?.length || 0
                                  );
                                }}
                              >
                                <a
                                  aria-haspopup="true"
                                  className="cursor-pointer"
                                >
                                  {issue.shared_with &&
                                  issue.shared_with.length > 0 ? (
                                    issue.shared_with.length === 1 ? (
                                      <span>{issue.shared_with[0]}</span>
                                    ) : (
                                      <span>
                                        {issue.shared_with[0]} +{' '}
                                        {issue.shared_with.length - 1} more
                                      </span>
                                    )
                                  ) : (
                                    <span>Public</span>
                                  )}
                                </a>
                              </PopoverTrigger>

                              <PopoverContent className="w-full">
                                <Input
                                  name="emailInput"
                                  type="email"
                                  placeholder="Add email"
                                  onChange={(e) => {
                                    setUpdatedEmail(e.target.value);
                                  }}
                                  onBlur={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.value) {
                                      handleUpdateEmail(updatedEmail, issue.id);
                                    }
                                  }}
                                />
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableCell>Email</TableCell>
                                    </TableRow>
                                  </TableHeader>

                                  <TableBody>
                                    {issue ? (
                                      issue.shared_with
                                        ?.slice(
                                          (currentPopoverPage - 1) *
                                            emailsPerPage,
                                          currentPopoverPage * emailsPerPage
                                        )
                                        .map((email: string) => (
                                          <TableRow key={email}>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>
                                              <Button
                                                variant="destructive"
                                                onClick={() => {
                                                  handleRemoveEmail(
                                                    email,
                                                    issue.id
                                                  );
                                                }}
                                              >
                                                Remove
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                    ) : (
                                      <TableRow>
                                        <TableCell>
                                          <Skeleton className="h-4 w-[250px]" />
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                                <Pagination>
                                  <PaginationContent>
                                    <PaginationItem>
                                      <PaginationPrevious
                                        className={
                                          currentPopoverPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : undefined
                                        }
                                        onClick={() => {
                                          setCurrentPopoverPage(
                                            currentPopoverPage - 1
                                          );
                                        }}
                                      />
                                    </PaginationItem>

                                    <PaginationItem>
                                      <PaginationNext
                                        className={
                                          currentPopoverPage * emailsPerPage >=
                                          totalEmails
                                            ? 'pointer-events-none opacity-50'
                                            : undefined
                                        }
                                        onClick={() => {
                                          if (
                                            currentPopoverPage * emailsPerPage <
                                            totalEmails
                                          ) {
                                            setCurrentPopoverPage(
                                              currentPopoverPage + 1
                                            );
                                          }
                                        }}
                                      />
                                    </PaginationItem>
                                  </PaginationContent>
                                </Pagination>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell>
                            <Link
                              className="text-blue-600 hover:underline"
                              href={
                                process.env.NEXT_PUBLIC_IS_DEV === 'true'
                                  ? `http://localhost:3000/issues/${issue.id}`
                                  : `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/issues/${issue.id}`
                              }
                            >
                              {`/issues/${issue.id}`}
                            </Link>
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
                ) : (
                  <>
                    <Skeleton className="h-4 w-[100%] mb-3" />
                    <Skeleton className="h-4 w-[100%] mb-3" />
                    <Skeleton className="h-4 w-[100%] mb-3" />
                    <Skeleton className="h-4 w-[100%] mb-3" />
                  </>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
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
              </CardFooter>
            </Card>
          </div>
        </div>
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
}
