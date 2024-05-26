import Signup from '@/components/layouts/auth/Signup';

import React from 'react';

type Props = {};

export default function SignupPage({}: Props) {
  return (
    <div className="container flex justify-center items-center min-h-screen">
      <Signup />
    </div>
  );
}
