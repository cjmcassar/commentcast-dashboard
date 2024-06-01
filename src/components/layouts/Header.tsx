'use client';

import { signOut } from '@/app/(auth)/signout/actions';
import { DarkModeButton } from '@/components/layouts/DarkModeButton';
import { createClient } from '@/utils/supabase/client';
import { Home, LineChart, Package2, PanelLeft, Search } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useToast } from '../ui/use-toast';

type Props = {};

interface UserInfo {
  email: string;
}

const Header = (props: Props) => {
  const router = useRouter();
  const posthog = usePostHog();
  const { toast } = useToast();

  const supportEmailLink =
    'mailto:christopherjcassar@gmail.com?subject=Bugs%20or%20Feedback&body=Please%20describe%20your%20issue%20or%20feedback%20in%20detail%20here.';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      posthog.capture('sign-out');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('Client-side sign out error:', error);
    }
  };

  const supabase = createClient();
  const [userInfo, setUserInfo] = useState<UserInfo | null>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const userEmail = session.user?.email || '';
          console.log('userEmail', userEmail);
          setUserInfo({
            email: userEmail,
          });
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user information.',
        });
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background py-4 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">CommentCast</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="relative ml-auto flex-1 md:grow-0 flex items-center gap-2">
          <DarkModeButton />

          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter Issues..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center"
              style={{ width: '36px', height: '36px' }}
            >
              {userInfo?.email[0].toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href={supportEmailLink} target="_blank" rel="noreferrer">
                Support
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
};

export default Header;
