'use client';

import { handlePublicSwitchChange } from '@/utils/publicSwitchChangeUtils';
import { handleQuickShareClick, handleShareConfirm } from '@/utils/shareUtils';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

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
  const [ownsIssue, setOwnsIssue] = useState(false);

  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const checkIssueOwnership = async () => {
      if (!selectedIssueId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('issue_snapshots')
        .select('uuid')
        .eq('id', selectedIssueId)
        .single();

      if (error) {
        return;
      }

      console.log('data', data);

      console.log('user', user);

      setOwnsIssue(data.uuid === user.id);
    };

    checkIssueOwnership();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIssueId]);

  return (
    <div>
      {' '}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {ownsIssue ? (
              <>
                <DialogTitle>
                  Enter the user&apos;s email to share the issue
                </DialogTitle>
                <DialogDescription>
                  This will create a shareable link that you can send to the
                  user.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>
                  Hmm, let&apos;s get some more eyes on this.
                </DialogTitle>
              </>
            )}
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
            {ownsIssue && (
              <>
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
              </>
            )}
            <div className="flex flex-col ">
              <Separator className="my-4" />
              {ownsIssue && (
                <>
                  <DialogDescription className="my-2">
                    Alternatively, create a link if you have already added a
                    user.
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
                </>
              )}
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
