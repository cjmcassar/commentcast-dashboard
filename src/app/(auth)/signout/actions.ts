'use server';

import { createClient } from '@/utils/supabase/server';

export async function signOut() {
  const supabase = createClient();

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out failed', error);
  }
}
