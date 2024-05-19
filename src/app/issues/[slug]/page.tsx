import Header from '@/components/layouts/Header';
import SideNavBar from '@/components/layouts/SideNavBar';
import IssueDetails from '@/components/layouts/issue-details/IssueDetails';
import IssueDetailsDashboard from '@/components/layouts/issue-details/IssueDetailsDashboard';

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
