'use client';

import { handlePublicSwitchChange } from '@/utils/publicSwitchChangeUtils';
import { handleQuickShareClick, handleShareConfirm } from '@/utils/shareUtils';

import React, { useEffect, useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ToastProps } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: (isShareDialogOpen: boolean) => void;
  selectedIssueId: number | null;
  sharedWithEmail: string;
  setSharedWithEmail: (sharedWithEmail: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
};

const ShareDialogue = ({
  isShareDialogOpen,
  setIsShareDialogOpen,
  selectedIssueId,
  sharedWithEmail,
  setSharedWithEmail,
  isPublic,
  setIsPublic,
}: Props) => {
  const { toast } = useToast();

  return (
    <div>
      {' '}
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

          <form
            onSubmit={(event) =>
              handleShareConfirm(
                event,
                selectedIssueId,
                sharedWithEmail,
                setIsShareDialogOpen,
                toast
              )
            }
          >
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
                  onCheckedChange={() =>
                    handlePublicSwitchChange(
                      selectedIssueId,
                      isPublic ?? false,
                      setIsPublic,
                      toast
                    )
                  }
                />
                <Label htmlFor="is_public">
                  Make Issue Public (anyone can view)
                </Label>
              </div>
              <Button
                onClick={() =>
                  handleQuickShareClick(
                    selectedIssueId as number,
                    setIsShareDialogOpen,
                    toast
                  )
                }
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

export default ShareDialogue;
