'use client';

import { confirmPasswordReset } from '@/app/(auth)/confirm-pwd-reset/actions';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Ensure this utility is created

const ConfirmPwdReset = () => {
  const [email, setEmail] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success, error } = await confirmPasswordReset(newPassword);
    if (success) {
      toast({
        title: 'Password Reset Success',
        description: 'Your password has been reset.',
      });
      router.push('/login');
    } else {
      toast({
        title: 'Password Reset Failed',
        description: `There was an error: ${error}`,
      });
      console.error(error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Reset Your Password</CardTitle>
        <CardDescription>Enter your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfirmPwdReset;
