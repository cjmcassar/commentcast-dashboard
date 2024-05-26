import { IssuesDashboard } from '@/components/layouts/main-dashboard/IssuesDashboard';
import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

import { TooltipProvider } from '@/components/ui/tooltip';

// Authentication and User Management
// 1. Add in dev env so that the CE can test locally easily
// 2.

// Issue Management
// 1.

// 2.
// 3. TODO: require email confirmation of the person you're sharing with
// 4. todo: Add multimodal AI to digest issues and summarize them

// User Interface Enhancements
// 1. todo: Add a basic settings page
// 2.
// 3.
// 4.

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
