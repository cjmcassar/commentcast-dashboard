'use server';

import { createClient } from '@/utils/supabase/server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = createClient();

  try {
    await supabase.auth.signOut();

    console.log('Sign out successful');
  } catch (error) {
    console.error('Sign out failed', error);
  }
}
