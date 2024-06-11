import { PHProvider } from '@/components/config/PostHogProvider';
import { ThemeProvider } from '@/components/config/ThemeProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PHProvider>
            <PostHogPageView />
            <main>{children}</main>
            <SpeedInsights />
            <Toaster />
          </PHProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
