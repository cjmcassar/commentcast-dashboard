import { IssuesDashboard } from '@/components/layouts/main-dashboard/IssuesDashboard';
import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

import { TooltipProvider } from '@/components/ui/tooltip';

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
