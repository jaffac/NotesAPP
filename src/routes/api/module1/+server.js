import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient'; // Import your Supabase client

export async function GET({ event }) {
  // Use the event object
  try {
    const {
      data: { session },
      error: supabaseError,
    } = await supabase.auth.getSession();

    if (supabaseError) {
      console.error('Supabase getSession error:', supabaseError);
      throw error(500, 'Supabase session error');
    }

    if (!session) {
      throw error(401, 'Unauthorized'); // Use throw error for proper error handling
    }

    return json({
      success: true,
      authenticatedUser: session.user,
    });
  } catch (err) {
    // Catch any other errors that may occur
    console.error('Error in GET handler:', err);
    if (err.status === 401) {
      throw err;
    }
    throw error(500, 'Internal Server Error'); // Throw a 500 error
  }
}
