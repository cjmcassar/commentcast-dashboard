'use server';

import { createClient } from '@/utils/supabase/server';

import { revalidatePath } from 'next/cache';

export async function signup(email: string, password: string) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true, error: null };
}
