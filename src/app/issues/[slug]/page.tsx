import Header from '@/components/layouts/Header';
import IssueDetails from '@/components/layouts/IssueDetails';
import SideNavBar from '@/components/layouts/SideNavBar';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function IssuePage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <TooltipProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <SideNavBar />
          <Header />

          <div className="flex justify-center sm:gap-4 sm:py-4 sm:pl-14">
            <IssueDetails slug={params.slug} />
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
