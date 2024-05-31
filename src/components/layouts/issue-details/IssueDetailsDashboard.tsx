import React from 'react';

import Header from '../Header';
import SideNavBar from '../SideNavBar';
import IssueDetails from './IssueDetails';

type Props = {
  slug: string;
};

export default function IssueDetailsDashboard({ slug }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNavBar />

      <Header />
      <div className="flex items-center flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <IssueDetails slug={slug} />
      </div>
    </div>
  );
}
