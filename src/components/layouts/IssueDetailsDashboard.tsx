import React from 'react';

import Header from './Header';
import IssueDetails from './IssueDetails';
import SideNavBar from './SideNavBar';

type Props = {
  slug: string;
};

export default function IssueDetailsDashboard({ slug }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNavBar />

      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <IssueDetails slug={slug} />
      </div>
    </div>
  );
}
