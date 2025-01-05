// src/routes/dashboard/+page.server.js
import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
  // Retrieve the Supabase session token
  const session = cookies.get('sb:session');

  if (!session) {
    throw redirect(303, '/login');
  }

  try {
    // Verify the user's session
    const { data, error } = await supabase.auth.getSession(session);

    if (error || !data.session) {
      // Clear invalid session cookie
      cookies.delete('sb:session', { path: '/' });
      throw redirect(303, '/login');
    }

    // Optional: Fetch additional user details
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.session.user.id)
      .single();

    return {
      user: {
        ...data.session.user,
        profile: userProfile || null,
      },
    };
  } catch (err) {
    console.error('Dashboard authentication error:', err);
    throw redirect(303, '/login');
  }
}

export const actions = {
  logout: async ({ cookies }) => {
    // Clear session cookie on logout
    cookies.delete('sb:session', { path: '/' });
    throw redirect(303, '/login');
  },
};
