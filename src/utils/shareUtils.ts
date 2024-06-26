import { createClient } from '@/utils/supabase/client';

import { ToastProps } from '@/components/ui/toast';

const supabase = createClient();

export const generateShareableLink = (issueId: number) => {
  return `${window.location.origin}/issues/${issueId}`;
};

export const handleShareClick = async (
  issueId: number,
  setSelectedIssueId: (issueId: number) => void,
  setIsShareDialogOpen: (isOpen: boolean) => void,
  setIsPublic: (isPublic: boolean) => void,
  toast: (toast: ToastProps) => void
) => {
  setSelectedIssueId(issueId);
  setIsShareDialogOpen(true);

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
    } as ToastProps);
  } else if (data) {
    setIsPublic(data.is_public);
  }
};

export const handleShareConfirm = async (
  event: React.FormEvent,
  selectedIssueId: number | null,
  sharedWithEmail: string,
  setIsShareDialogOpen: (isOpen: boolean) => void,
  toast: (toast: ToastProps) => void
) => {
  event.preventDefault();
  if (selectedIssueId !== null && sharedWithEmail) {
    const shareableLink = generateShareableLink(selectedIssueId);
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: `User email added to shared with and link copied to clipboard!`,
        description: 'Share the link with your team.',
      } as ToastProps);
    });

    // Fetch the current 'shared_with' array
    const { data, error } = await supabase
      .from('issue_snapshots')
      .select('shared_with')
      .eq('id', selectedIssueId)
      .single();

    if (error) {
      console.error('Error fetching shared_with array:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sharing details. Please try again.',
      } as ToastProps);
      return;
    }

    // Use a Set to ensure the email is unique in the array
    const updatedSharedWith = Array.from(
      new Set([...data.shared_with, sharedWithEmail])
    );

    // Update the record with the new array
    const { error: updateError } = await supabase
      .from('issue_snapshots')
      .update({ shared_with: updatedSharedWith })
      .eq('id', selectedIssueId);

    if (updateError) {
      console.error('Error updating shared_with array:', updateError);
      toast({
        title: 'Error',
        description: 'Failed to update sharing details. Please try again.',
      } as ToastProps);
    } else {
      setIsShareDialogOpen(false);
    }
  } else {
    toast({
      title: 'Invalid Submission',
      description: 'Please check the email address and try again.',
    } as ToastProps);
  }
};

export const handleQuickShareClick = (
  issueId: number,
  setIsShareDialogOpen: (isOpen: boolean) => void,
  toast: (toast: ToastProps) => void
) => {
  const shareableLink = generateShareableLink(issueId);
  navigator.clipboard
    .writeText(shareableLink)
    .then(() => {
      toast({
        title: 'Shareable link copied to clipboard!',
        description:
          'You can now share the link quickly without additional permissions.',
      } as ToastProps);
      setIsShareDialogOpen(false);
    })
    .catch((error) => {
      console.error('Failed to copy link to clipboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard. Please try again.',
      } as ToastProps);
    });
};
