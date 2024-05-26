import PwdReset from '@/components/layouts/auth/PwdReset';

import React from 'react';

type Props = {};

export default function PwdResetPage(props: Props) {
  return (
    <div className="container flex justify-center items-center min-h-screen">
      <PwdReset />
    </div>
  );
}
