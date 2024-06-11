'use client';

import DeleteDialogue from '@/components/layouts/DeleteDialogue';
import ImageDialogue from '@/components/layouts/ImageDialogue';
import ShareDialogue from '@/components/layouts/ShareDialogue';
import ConsoleAndNetworkTable from '@/components/layouts/issue-details/ConsoleAndNetworkTable';
import IssueDetailsLoading from '@/components/layouts/issue-details/IssueDetailsLoading';
import { Issue } from '@/types/issue';
import { handleDeleteClick } from '@/utils/deleteIssueUtils';
import { handleShareClick } from '@/utils/shareUtils';
import { createClient } from '@/utils/supabase/client';
import { MoreHorizontal, Share, TrashIcon } from 'lucide-react';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
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

const IssueDetails = ({ slug }: Props) => {
  const [issue, setIssue] = useState<Issue>(new Issue());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [ownsIssue, setOwnsIssue] = useState(false);
  const [isPublic, setIsPublic] = useState<boolean>();
  const [sharedWithEmail, setSharedWithEmail] = useState('');

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

  useEffect(() => {
    const checkIssueOwnership = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('issue_snapshots')
        .select('uuid')
        .eq('id', slug)
        .single();

      if (error) {
        return;
      }

      setOwnsIssue(data.uuid === user.id);
    };

    checkIssueOwnership();
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

  const handleImageClick = () => {
    setIsImageDialogOpen(true);
  };

  return (
    <div>
      <Card className="overflow-hidden min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[1000px]">
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Below are the detailed notes of the reported issues
              </CardDescription>
            </div>
            <div>
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
                <DropdownMenuContent className="mr-4">
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

                  {ownsIssue && (
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
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full h-full">
                <h1 className="mt-2 mb-4 text-sm font-medium text-muted-foreground">
                  Screenshot
                </h1>
                <AspectRatio
                  ratio={16 / 9}
                  className="bg-muted cursor-pointer rounded"
                  onClick={handleImageClick}
                >
                  {issue.id === 0 ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <Image
                      alt="Product image"
                      className="aspect-square object-contain rounded"
                      fill={true}
                      src={issue.screenshot}
                    />
                  )}
                </AspectRatio>
              </div>

              {issue.id !== 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Browser Details </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
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
                          handleCopyToClipboard(
                            issue.platform_os,
                            'Platform OS'
                          )
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
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <IssueDetailsLoading />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConsoleAndNetworkTable
        browserConsoleData={issue.browser_console_data}
        networkData={issue.browser_network_data}
        handleCopyToClipboard={handleCopyToClipboard}
      />

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

      <ImageDialogue
        isImageDialogOpen={isImageDialogOpen}
        setIsImageDialogOpen={setIsImageDialogOpen}
        screenshot={issue.screenshot}
      />
    </div>
  );
};

export default IssueDetails;
