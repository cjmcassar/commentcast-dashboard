'use server';

import { createClient } from '@/utils/supabase/server';

interface LoginResponse {
  success: boolean;
  error: string | null;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data: LoginRequest = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
