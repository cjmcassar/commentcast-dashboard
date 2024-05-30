import { Issue } from '@/types/issue';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface ConfirmDeleteProps {
  selectedIssueId: number | null;
  deleteIssue: (
    issueId: number,
    setIssues: (callback: (prevIssues: Issue[]) => Issue[]) => void
  ) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIssues: (callback: (prevIssues: Issue[]) => Issue[]) => void;
}

export const deleteIssue = async (
  issueId: number,
  setIssues: (callback: (prevIssues: Issue[]) => Issue[]) => void
) => {
  const { error } = await supabase
    .from('issue_snapshots')
    .delete()
    .eq('id', issueId);

  if (error) {
    console.error('Error deleting issue:', error);
    return;
  }

  // Refresh the issues list after deletion
  setIssues((prevIssues) => {
    if (!Array.isArray(prevIssues)) {
      window.location.href = '/';
      return [];
    }
    const filteredIssues = prevIssues.filter((issue) => issue.id !== issueId);
    return filteredIssues.length > 0 ? filteredIssues : [];
  });
};

export const handleDeleteClick = (
  issueId: number,
  setSelectedIssueId: (issueId: number | null) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void
) => {
  setSelectedIssueId(issueId);
  setIsDeleteDialogOpen(true);
};

export const confirmDelete = (
  selectedIssueId: number | null,
  deleteIssue: (
    issueId: number,
    setIssues: (callback: (prevIssues: Issue[]) => Issue[]) => void
  ) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setIssues: (callback: (prevIssues: Issue[]) => Issue[]) => void
) => {
  if (selectedIssueId !== null) {
    deleteIssue(selectedIssueId, setIssues);
  }
  setIsDeleteDialogOpen(false);
};
