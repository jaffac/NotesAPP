<script>
  import '../app.css';
  import { supabase } from '$lib/supabaseClient';
  import { user } from '$lib/auth';

  // Optional: Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    user.set(session?.user || null);
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/assets/_layout.DuR7XZFh.css" />
</svelte:head>

<div class="min-h-screen bg-gray-900 text-gray-200">
  <slot />
</div>
