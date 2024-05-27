'use server';

import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

const supabase = createClient();

export async function confirmPasswordReset(
  newPassword: string,
  searchParamsCode: string
) {
  try {
    if (searchParamsCode) {
      const supabase = createClient();
      const { error } =
        await supabase.auth.exchangeCodeForSession(searchParamsCode);

      if (error) {
        return redirect(`/pwd-reset`);
      }
    }
    // Verify the code and email (this part depends on your backend implementation)
    // Assuming the code is valid and email is verified, proceed to update the password
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
