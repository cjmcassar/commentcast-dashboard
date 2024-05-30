import { ToastProps } from '@/components/ui/toast';

import { createClient } from './supabase/client';

const supabase = createClient();

export const handlePublicSwitchChange = async (
  selectedIssueId: number | null,
  isPublic: boolean,
  setIsPublic: (isPublic: boolean) => void,
  toast: (toast: ToastProps) => void
) => {
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
      } as ToastProps);
    } else {
      console.log('Issue visibility updated:', data.is_public);
      toast({
        title: 'Success',
        description: data.is_public
          ? 'Issue is now public (anyone can view it)'
          : 'Issue is private. Please add their email before sharing the link',
      } as ToastProps);
    }
  }
};
