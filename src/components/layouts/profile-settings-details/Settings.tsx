'use client';

import { createClient } from '@/utils/supabase/client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

//todo: add a table that shows all of the issues that are currently public and being shared
//todo: Allow user to revoke access to issues that they have shared by deleting emails from the table

export function SettingsDetails() {
  const [combinedPublicAndSharedIssues, setCombinedPublicAndSharedIssues] =
    useState<any[] | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchSharedIssues = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const publicQuery = supabase.from('issue_snapshots').select('*');
      const sharedQuery = supabase.from('issue_snapshots').select('*');

      let getPublicIssues = async () => {
        const response = await publicQuery
          .eq('is_public', true)
          .eq('uuid', user?.id);
        return response.data ?? [];
      };

      let getSharedIssues = async () => {
        const response = await sharedQuery
          .eq('uuid', user?.id)
          .not('shared_with', 'is', null);
        return response.data ?? [];
      };

      const publicIssues = await getPublicIssues();
      const sharedIssues = await getSharedIssues();

      const combinedIssues = [...publicIssues, ...sharedIssues];
      const uniqueIssues = combinedIssues.filter(
        (issue, index, self) =>
          index === self.findIndex((i) => i.id === issue.id)
      );
      setCombinedPublicAndSharedIssues(uniqueIssues);
    };

    fetchSharedIssues();
  }, []);

  console.log('combinedPublicAndSharedIssues', combinedPublicAndSharedIssues);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Security</Link>
            <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>User Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Email" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Shared Issues</CardTitle>
                <CardDescription>
                  The issues that you have shared with other users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Issue</TableCell>
                      <TableCell>Shared With</TableCell>
                      <TableCell>Issue Link</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {combinedPublicAndSharedIssues?.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>{issue.id}</TableCell>
                        <TableCell>
                          {issue.shared_with
                            ? issue.shared_with
                            : issue.is_public
                              ? 'Public'
                              : ''}
                        </TableCell>
                        <TableCell>
                          <Link
                            className="text-blue-600 hover:underline"
                            href={
                              process.env.NEXT_PUBLIC_IS_DEV === 'true'
                                ? `http://localhost:3000/issues/${issue.id}`
                                : `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/issues/${issue.id}`
                            }
                          >
                            {`/issues/${issue.id}`}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={issue.is_public} />
                          <Label className="text-sm ml-2" htmlFor="include">
                            is public
                          </Label>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
