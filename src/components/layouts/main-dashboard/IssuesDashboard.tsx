import Header from '../Header';
import SideNavBar from '../SideNavBar';
import IssueTable from './IssueTable';

export function IssuesDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNavBar />
      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <IssueTable />
      </div>
    </div>
  );
}
