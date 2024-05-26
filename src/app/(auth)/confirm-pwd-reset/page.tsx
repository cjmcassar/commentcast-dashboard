import ConfirmPwdReset from '@/components/layouts/auth/ConfirmPwdReset';

import React from 'react';

type Props = {};

export default function ConfirmPwdResetPage({}: Props) {
  return (
    <div className="container flex justify-center items-center min-h-screen">
      <ConfirmPwdReset />
    </div>
  );
}
