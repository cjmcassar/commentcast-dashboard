import Header from '@/components/layouts/Header';
import SideNavBar from '@/components/layouts/SideNavBar';
import { SettingsDetails } from '@/components/layouts/profile-settings-details/Settings';

import React from 'react';

type Props = {};

export default function SettingsDashboard({}: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideNavBar />
      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <SettingsDetails />
      </div>
    </div>
  );
}
