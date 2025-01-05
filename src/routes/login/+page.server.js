// src/routes/login/+page.server.js
import { supabase } from '$lib/supabaseClient';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      return fail(400, {
        email,
        error: 'Email and password are required',
      });
    }

    try {
      // Attempt to sign in with Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return fail(400, {
          email,
          error: error.message,
        });
      }

      // Create a secure session cookie
      if (authData.session) {
        cookies.set('sb:session', authData.session.access_token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        // Redirect to dashboard on successful login
        throw redirect(303, '/dashboard');
      }

      return fail(400, {
        email,
        error: 'Authentication failed',
      });
    } catch (err) {
      console.error('Login error:', err);
      return fail(500, {
        email,
        error: 'An unexpected error occurred',
      });
    }
  },
};

// Optional: Prevent logged-in users from accessing login page
export async function load({ cookies }) {
  const session = cookies.get('sb:session');

  if (session) {
    throw redirect(303, '/dashboard');
  }

  return {};
}
