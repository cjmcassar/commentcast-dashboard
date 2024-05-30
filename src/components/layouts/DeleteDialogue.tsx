import { Issue } from '@/types/issue';
import { confirmDelete, deleteIssue } from '@/utils/deleteIssueUtils';

import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void;
  selectedIssueId: number | null;
  setIssues: (
    callback: (prevIssues: Issue | Issue[]) => Issue | Issue[]
  ) => void;
};

const DeleteDialogue = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedIssueId,
  setIssues,
}: Props) => {
  return (
    <div>
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
            <Button
              onClick={() =>
                confirmDelete(
                  selectedIssueId,
                  deleteIssue,
                  setIsDeleteDialogOpen,
                  setIssues as React.Dispatch<React.SetStateAction<Issue[]>>
                )
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDialogue;
