'use client';

import { createClient } from '@/utils/supabase/client';
import { usePostHog } from 'posthog-js/react';

import { FormEvent, useState } from 'react';

import Link from 'next/link';
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

export default function LoginForm({ login }: { login: any; signup: any }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const { toast } = useToast();
  const posthog = usePostHog();
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', username);
      formData.append('password', password);

      const result = await login(formData);
      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
        });
      } else {
        toast({
          title: `${username} logged in`,
          description: 'Redirecting to your dashboard...',
        });
        posthog.identify(username, {
          userId: (await supabase.auth.getSession()).data.session?.user.id,
          email: username,
        });
        posthog.capture('sign-in', {
          email: username,
        });
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/pwd-reset"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type={'submit'} className="w-full">
            Login
          </Button>
          {/* button to show toast */}
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
