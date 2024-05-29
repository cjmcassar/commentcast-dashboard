'use server';

import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

const supabase = createClient();

export async function confirmPasswordReset(
  newPassword: string,
  searchParamsCode: string
) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}
