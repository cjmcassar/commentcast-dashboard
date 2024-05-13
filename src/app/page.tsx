import { IssuesDashboard } from '@/components/layouts/IssuesDashboard';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Home() {
  return (
    <div>
      <TooltipProvider>
        <IssuesDashboard />
      </TooltipProvider>
    </div>
  );
}
