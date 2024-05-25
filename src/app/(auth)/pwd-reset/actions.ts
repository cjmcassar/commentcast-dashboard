'use server';

import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

const supabase = createClient();

export async function resetPassword(email: string) {
  if (!process.env.IS_DEV) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.PRODUCTION_URL}/confirm-pwd-reset`,
    });

    if (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } else {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/confirm-pwd-reset',
    });

    if (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  }
}
