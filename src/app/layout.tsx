import { PHProvider } from '@/components/config/PostHogProvider';
import type { Metadata } from 'next';

import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'commentcast-dashboard',
  description: 'Locate and share issues with your team.',
};

const PostHogPageView = dynamic(
  () => import('@/components/config/PostHogPageView'),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          <PostHogPageView />
          <main>{children}</main> <Toaster />
        </PHProvider>
      </body>
    </html>
  );
}
