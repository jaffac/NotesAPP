<!-- src/routes/login/+page.svelte -->
<script>
  import { enhance } from '$app/forms';

  export let form;
  export let data;
</script>

<div class="login-container">
  <form method="POST" action="?/login" use:enhance>
    <h2>Login</h2>

    {#if form?.error}
      <div class="error-message">
        {form.error}
      </div>
    {/if}

    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        required
        value={form?.email ?? ''}
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required />
    </div>

    <button type="submit">Login</button>
  </form>
</div>

<style>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .error-message {
    color: red;
    margin-bottom: 15px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>
