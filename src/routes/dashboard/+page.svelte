<script>
  import { user } from '$lib/auth';
  import { signOut } from '$lib/auth';

  export let data;

  async function handleSignOut() {
    await signOut();
  }
</script>

<div class="container py-8">
  <div class="card">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    {#if data.user}
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          {#if data.user.user_metadata.avatar_url}
            <img
              src={data.user.user_metadata.avatar_url}
              alt="Profile"
              class="w-12 h-12 rounded-full"
            />
          {/if}
          <div>
            <p class="font-semibold">
              {data.user.user_metadata.full_name || 'User'}
            </p>
            <p class="text-sm text-gray-400">{data.user.email}</p>
          </div>
        </div>

        <button on:click={handleSignOut} class="btn btn-primary w-full">
          Sign Out
        </button>
      </div>
    {:else}
      <p>Please log in to access your dashboard.</p>
    {/if}
  </div>
</div>
