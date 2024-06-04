import SettingsDashboard from '@/components/layouts/profile-settings-details/SettingsDashboard';

import React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

type Props = {};

export default function ProfileSettings({}: Props) {
  return (
    <div>
      <TooltipProvider>
        <SettingsDashboard />
      </TooltipProvider>
    </div>
  );
}
