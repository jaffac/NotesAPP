// src/lib/auth.js
import { supabase } from './supabaseClient';
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

export const user = writable(null);

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected authentication error:', err);
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign Out Error:', error);
    } else {
      user.set(null);
      goto('/login');
    }
  } catch (err) {
    console.error('Unexpected sign out error:', err);
  }
}

// Set up initial auth state
supabase.auth.onAuthStateChange((event, session) => {
  user.set(session?.user || null);
});
