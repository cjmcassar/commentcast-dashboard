import Header from '@/components/layouts/Header';
import IssueDetails from '@/components/layouts/IssueDetails';
import IssueDetailsDashboard from '@/components/layouts/IssueDetailsDashboard';
import SideNavBar from '@/components/layouts/SideNavBar';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function IssuePage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <TooltipProvider>
        <IssueDetailsDashboard slug={params.slug} />
      </TooltipProvider>
    </div>
  );
}
