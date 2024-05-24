'use server';

import { createClient } from '@/utils/supabase/server';

export async function signOut() {
  const supabase = createClient();

  try {
    await supabase.auth.signOut();

    console.log('Sign out successful');
  } catch (error) {
    console.error('Sign out failed', error);
  }
}
