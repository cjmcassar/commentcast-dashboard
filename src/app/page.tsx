import { IssuesDashboard } from '@/components/layouts/IssuesDashboard';
import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

import { TooltipProvider } from '@/components/ui/tooltip';

// Authentication and User Management
// todo: Clean up authentication flow (consider creating a state management system)

// Issue Management
// todo: Simplify the issue details page to make it cleaner like the issues dashboard page
// todo: Make issues clickable and redirect to the issue details page
// todo: Allow users to view only their own issues on the dashboard
// todo: Make the issue details link shareable (maybe require email as verification)
// todo: Require confirmation to delete an issue
// todo: Add multimodal AI to digest issues and summarize them

// User Interface Enhancements
// todo: Add a basic settings page
// todo: Make the support button open an email
// todo: Add in feedback mechanism when screenshot is taken

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('No user found, redirecting to login');
    redirect('/login');
  }

  return (
    <div>
      <TooltipProvider>
        <IssuesDashboard />
      </TooltipProvider>
    </div>
  );
}
