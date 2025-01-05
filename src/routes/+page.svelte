<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';

  let notes = [];
  let loading = true;
  let error = null;
  let user = null;
  let newNoteTitle = '';
  let newNoteContent = '';
  let editingNoteId = null;
  let editingNoteTitle = '';
  let editingNoteContent = '';

  async function fetchUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user = session?.user;
  }

  onMount(async () => {
    await fetchUser();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user = session?.user;
      if (user) {
        await fetchNotes();
      } else {
        notes = [];
      }
    });

    if (user) {
      await fetchNotes();
    }
  });

  async function fetchNotes() {
    if (!user) return;
    loading = true;
    error = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      notes = data || [];
    } catch (err) {
      error = err.message;
      console.error('Error fetching notes:', err);
    } finally {
      loading = false;
    }
  }

  async function createNote() {
    if (!newNoteTitle || !newNoteContent) return;
    try {
      const { error } = await supabase
        .from('notes')
        .insert([
          { user_id: user.id, title: newNoteTitle, content: newNoteContent },
        ]);
      if (error) throw error;
      newNoteTitle = '';
      newNoteContent = '';
      fetchNotes();
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Error creating note.');
    }
  }

  async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Error deleting note.');
    }
  }

  function startEditing(note) {
    editingNoteId = note.id;
    editingNoteTitle = note.title;
    editingNoteContent = note.content;
  }

  async function saveEdit() {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title: editingNoteTitle, content: editingNoteContent })
        .eq('id', editingNoteId);
      if (error) throw error;
      editingNoteId = null;
      fetchNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Error updating note.');
    }
  }

  function cancelEdit() {
    editingNoteId = null;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      alert(`Error signing in: ${error.message}`);
      console.error('Error signing in:', error);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Error signing out: ${error.message}`);
      console.error('Error signing out:', error);
    }
  }
</script>

<div
  class="container mx-auto p-8 rounded-lg shadow-md min-h-screen flex flex-col transition duration-300 bg-gray-900 text-gray-200"
>
  <h1 class="text-5xl font-bold mb-6 text-center text-gray-100">
    Welcome to My Notes
  </h1>
  {#if user}
    <div class="flex justify-between items-center mb-4">
      <button
        on:click={signOut}
        class="bg-blue-800 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded transition duration-300"
        >Sign Out</button
      >
    </div>
    <div class="mb-4">
      <input
        type="text"
        placeholder="Note Title"
        bind:value={newNoteTitle}
        class="border border-gray-700 rounded p-2 w-full mb-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none"
      />
      <textarea
        placeholder="Note Content"
        bind:value={newNoteContent}
        class="border border-gray-700 rounded p-2 w-full h-24 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none"
      ></textarea>
      <button
        on:click={createNote}
        class="bg-green-800 hover:bg-green-700 text-gray-200 font-bold py-2 px-4 rounded mt-2 w-full transition duration-300"
        >Add Note</button
      >
    </div>

    {#if loading}
      <p class="text-center text-gray-500">Loading notes...</p>
    {:else if error}
      <p class="text-red-400 text-center">Error: {error}</p>
    {:else if notes.length === 0}
      <p class="text-center text-gray-500">No notes yet.</p>
    {:else}
      <ul class="space-y-4">
        {#each notes as note (note.id)}
          <li class="border border-gray-800 rounded p-4 shadow-md bg-gray-800">
            {#if editingNoteId === note.id}
              <input
                type="text"
                bind:value={editingNoteTitle}
                class="border border-gray-700 rounded p-2 w-full mb-2 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              />
              <textarea
                bind:value={editingNoteContent}
                class="border border-gray-700 rounded p-2 w-full h-24 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-gray-600 focus:outline-none"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button
                  on:click={saveEdit}
                  class="bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded mr-2 transition duration-300"
                  >Save</button
                >
                <button
                  on:click={cancelEdit}
                  class="bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded transition duration-300"
                  >Cancel</button
                >
              </div>
            {:else}
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-xl font-semibold text-gray-100">
                    {note.title}
                  </h3>
                  <p class="text-gray-400">{note.content}</p>
                </div>
                <div class="flex">
                  <button
                    on:click={() => startEditing(note)}
                    class="bg-yellow-800 hover:bg-yellow-700 text-yellow-200 font-bold py-1 px-2 rounded mr-1 transition duration-300"
                    >Edit</button
                  >
                  <button
                    on:click={() => deleteNote(note.id)}
                    class="bg-red-800 hover:bg-red-700 text-red-200 font-bold py-1 px-2 rounded transition duration-300"
                    >Delete</button
                  >
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  {:else}
    <div class="flex justify-center items-center h-full">
      <button
        on:click={signInWithGoogle}
        class="bg-blue-800 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded transition duration-300"
        >Sign In with Google</button
      >
    </div>
  {/if}

  <footer class="mt-auto text-center text-gray-500 text-sm py-4">
    <p>
      Made by
      <a
        href="https://github.com/jaffac"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-gray-300 transition duration-300 underline"
      >
        jaffac
      </a>
      &copy; {new Date().getFullYear()}
    </p>
  </footer>
</div>
