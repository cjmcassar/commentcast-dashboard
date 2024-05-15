import { createClient } from '@/utils/supabase/server';

import { redirect } from 'next/navigation';

//todo: remove this one auth is added to the page. Just to test the auth flow

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  console.log('user data', data);

  return <p>Hello {data.user.email}</p>;
}
