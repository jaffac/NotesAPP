// src/routes/+layout.server.js
import { supabase } from '$lib/supabaseClient'; // Import your Supabase client

export const load = async ({ event }) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    session: session, // This will be null if the user is not logged in
  };
};
